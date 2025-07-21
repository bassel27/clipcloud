import { Request, Response } from 'express';
import { signupUser } from '../services/signup.service';

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