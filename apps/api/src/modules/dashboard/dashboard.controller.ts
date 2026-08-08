import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { sendResponse } from '../../shared/response';

export class DashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboardData = await DashboardService.getDashboardData();
      sendResponse(res, 200, true, dashboardData);
    } catch (error) {
      next(error);
    }
  }
}
