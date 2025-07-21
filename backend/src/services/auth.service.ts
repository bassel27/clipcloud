import { findUserByEmail, create } from "../repositories/auth.repository";
import bcrypt from 'bcrypt';

export const signupUser = async (email: string, password: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await create(email, hashedPassword);
  return newUser;
};