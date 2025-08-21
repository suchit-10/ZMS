import { config } from '../config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends  Request {
  claims?: TokenPayload;
}

export interface TokenPayload extends jwt.JwtPayload {

  user_id?: string
  username?: string
  email?: string

}

export const JWTMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    req.claims = {
      user_id: decoded.user_id,
      username: decoded.username,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const GenerateTokenPayload = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '24h' });
  return token;
};