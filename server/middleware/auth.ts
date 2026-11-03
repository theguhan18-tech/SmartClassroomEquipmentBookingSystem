import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore, IUser } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-classroom-secure-jwt-key-2026-agile';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = dbStore.findUserById(decoded.id);

    if (!user || user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'User account not found or suspended.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
  }
  next();
};

export const requireFacultyOrStudent = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'faculty' && req.user.role !== 'student' && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Access denied. Valid academic role required.' });
  }
  next();
};

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
