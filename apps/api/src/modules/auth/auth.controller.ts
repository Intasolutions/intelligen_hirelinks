import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '@hirelinks/contracts';
import { AuthService } from './auth.service';
import { sendResponse } from '../../shared/response';
import { cookieOptions } from '../../shared/jwt';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body);
      const { token, user } = await AuthService.login(payload);
      
      res.cookie('token', token, cookieOptions);
      
      sendResponse(res, 200, true, { user }, null, { message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token', cookieOptions);
      sendResponse(res, 200, true, null, null, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      sendResponse(res, 200, true, user);
    } catch (error) {
      next(error);
    }
  }
}
