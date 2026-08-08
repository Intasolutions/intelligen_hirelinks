import { Request, Response, NextFunction } from 'express';
import { ContactEngine } from './contact.service';
import { contactSchema } from '@hirelinks/contracts';

export class ContactController {
  static async createPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = contactSchema.parse(req.body);
      const data = await ContactEngine.createPublic(validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Contact Submit Error', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async listContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status, type } = req.query;
      
      const result = await ContactEngine.listContacts({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        source: type as string
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactEngine.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
        throw new Error('Invalid status');
      }
      const data = await ContactEngine.updateStatus(req.params.id, status);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteContact(req: Request, res: Response, next: NextFunction) {
    try {
      await ContactEngine.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
  
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactEngine.getStats();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
