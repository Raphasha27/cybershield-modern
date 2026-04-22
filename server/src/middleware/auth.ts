import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      ip?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }
    next();
  };
};
