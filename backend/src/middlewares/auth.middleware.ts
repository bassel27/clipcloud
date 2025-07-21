import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET); // The payload returned by jwt.verify() is the data that was originally embedded in the token when it was signed 
    (req as Request & { user?: any }).user = payload;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};