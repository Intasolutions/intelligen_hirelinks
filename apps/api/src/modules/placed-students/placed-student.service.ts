import { PlacedStudent, IPlacedStudent } from './placed-student.model';
import { PlacedStudentInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';

export class PlacedStudentService {
  /**
   * List placed students with standard CMS pagination, search, and filters.
   */
  static async listPlacedStudents(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IPlacedStudent> = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { program: { $regex: query.search, $options: 'i' } },
        { country: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.status) filter.status = query.status;

    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (query.sort === 'newest') sortObj = { createdAt: -1 };
    else if (query.sort === 'oldest') sortObj = { createdAt: 1 };

    const data = await PlacedStudent.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PlacedStudent.countDocuments(filter);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getPublicPlacedStudents() {
    return PlacedStudent.find({ status: 'ACTIVE' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    const student = await PlacedStudent.findById(id).lean();
    if (!student) throw new Error('Placed student not found');
    return student;
  }

  static async createPlacedStudent(data: PlacedStudentInput, adminId: string, file?: Express.Multer.File) {
    let photo;

    if (file) {
      photo = await CloudinaryService.uploadBuffer(file.buffer, 'placed-students');
    }

    const student = new PlacedStudent({
      ...data,
      photo,
      createdBy: adminId,
      updatedBy: adminId
    });

    await student.save();
    return student;
  }

  static async updatePlacedStudent(id: string, data: Partial<PlacedStudentInput>, adminId: string, file?: Express.Multer.File) {
    const student = await PlacedStudent.findById(id);
    if (!student) throw new Error('Placed student not found');

    if (file) {
      if (student.photo?.publicId) {
        await CloudinaryService.deleteAsset(student.photo.publicId);
      }
      student.photo = await CloudinaryService.uploadBuffer(file.buffer, 'placed-students');
    } else if (data.removeImage) {
      if (student.photo?.publicId) {
        await CloudinaryService.deleteAsset(student.photo.publicId);
      }
      student.photo = undefined;
    }

    Object.assign(student, data);
    student.updatedBy = adminId as any;

    await student.save();
    return student;
  }

  static async softDelete(id: string, adminId: string) {
    const student = await PlacedStudent.findById(id);
    if (!student) throw new Error('Placed student not found');

    student.deletedAt = new Date();
    student.deletedBy = adminId as any;
    await student.save();

    return true;
  }
}
