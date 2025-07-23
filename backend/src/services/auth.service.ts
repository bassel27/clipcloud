import { findUserByEmail, create, saveRefreshToken, getUserByRefreshToken } from "../repositories/auth.repository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET  as string;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY  as string;
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY  as string;


export const signupUser = async (email: string, password: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await create(email, hashedPassword);
  return newUser;
};

export const signinUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const accessToken = jwt.sign(
    { userId: user.id }, 
    JWT_ACCESS_SECRET, 
    { expiresIn: JWT_ACCESS_EXPIRY } as jwt.SignOptions
  );

  const refreshToken = jwt.sign({ userId: user.id }, 
    JWT_REFRESH_SECRET, 
    { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions
  );

  await saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken};
};

export const issueNewAccessToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    const user = await getUserByRefreshToken(token);
    if (!user || user.id !== payload.userId) throw new Error();

    const newAccessToken = jwt.sign(
      { userId: user.id }, 
      JWT_ACCESS_SECRET, 
      { expiresIn: JWT_ACCESS_EXPIRY } as jwt.SignOptions
    ) ;

    // Only rotate refresh token if it's close to expiry (e.g., 50% of lifetime)
    const tokenAge = Date.now() - (payload.iat * 1000);
    const shouldRotate = tokenAge > (Number(JWT_REFRESH_EXPIRY) * 0.5); 

    let newRefreshToken = token; // Keep existing by default
    
    if (shouldRotate) {
      newRefreshToken = jwt.sign(
        { userId: user.id }, 
        JWT_REFRESH_SECRET, 
        { expiresIn: JWT_REFRESH_EXPIRY } as jwt.SignOptions
      );
      await saveRefreshToken(user.id, newRefreshToken);
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};