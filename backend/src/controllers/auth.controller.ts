import { Request, Response } from 'express';
import { issueNewAccessToken, signinUser, signupUser } from '../services/auth.service';

export const signupHandler = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    const user = await signupUser(email, password);
    return res.status(201).json({ 
      message: "User created successfully", 
      user: { id: user.id, email: user.email } 
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const signinHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const tokens = await signinUser(email, password);
    res.status(200).json(tokens);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const issueNewAccessTokenHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const tokens = await issueNewAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (err: any) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};