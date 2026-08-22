import { Request, Response, NextFunction } from 'express';
import { PlacedStudentService } from './placed-student.service';
import { placedStudentSchema } from '@hirelinks/contracts';

export class PlacedStudentController {
  static async listPlacedStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, sort } = req.query;

      const result = await PlacedStudentService.listPlacedStudents({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        sort: sort as string
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicPlacedStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PlacedStudentService.getPublicPlacedStudents();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getPlacedStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PlacedStudentService.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async createPlacedStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // Body may have stringified JSON or raw string fields due to FormData.
      // Zod coerce will handle most of the typing correctly.
      const validatedData = placedStudentSchema.parse(req.body);
      const adminId = (req.user as any)?.userId;

      const data = await PlacedStudentService.createPlacedStudent(validatedData, adminId, req.file);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updatePlacedStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = placedStudentSchema.partial().parse(req.body);
      const adminId = (req.user as any)?.userId;

      const data = await PlacedStudentService.updatePlacedStudent(req.params.id, validatedData, adminId, req.file);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async deletePlacedStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as any)?.userId;
      await PlacedStudentService.softDelete(req.params.id, adminId);
      res.status(200).json({ success: true, message: 'Placed student deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
