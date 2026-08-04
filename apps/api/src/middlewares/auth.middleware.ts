import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../shared/jwt';
import { UnauthorizedError } from '../shared/errors';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
