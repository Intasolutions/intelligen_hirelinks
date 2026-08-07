import { Program, IProgram } from './program.model';
import { ProgramInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';
import slugify from 'slugify';

export class ProgramEngine {
  static async listPrograms(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    publishStatus?: string;
    isFeatured?: boolean;
    sort?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IProgram> = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { shortDescription: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.status) filter.status = query.status;
    if (query.publishStatus) filter.publishStatus = query.publishStatus;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (query.sort === 'newest') sortObj = { createdAt: -1 };
    else if (query.sort === 'oldest') sortObj = { createdAt: 1 };

    const data = await Program.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Program.countDocuments(filter);

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

  static async getPublicPrograms() {
    return Program.find({ status: 'ACTIVE', publishStatus: 'PUBLISHED' })
      .sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    const program = await Program.findById(id).lean();
    if (!program) throw new Error('Program not found');
    return program;
  }

  static async getBySlug(slug: string) {
    const program = await Program.findOne({ slug, status: 'ACTIVE', publishStatus: 'PUBLISHED' }).lean();
    if (!program) throw new Error('Program not found');
    return program;
  }

  static async createProgram(
    data: ProgramInput, 
    adminId: string, 
    files?: {
      primaryImage?: Express.Multer.File[];
      secondaryImage?: Express.Multer.File[];
    }
  ) {
    let primaryImage, secondaryImage;
    
    if (files?.primaryImage?.[0]) {
      primaryImage = await CloudinaryService.uploadBuffer(files.primaryImage[0].buffer, 'programs');
    }
    if (files?.secondaryImage?.[0]) {
      secondaryImage = await CloudinaryService.uploadBuffer(files.secondaryImage[0].buffer, 'programs');
    }

    const programData: any = {
      ...data,
      primaryImage,
      secondaryImage,
      createdBy: adminId,
      updatedBy: adminId
    };

    if (!programData.slug) {
      programData.slug = slugify(data.title, { lower: true, strict: true });
    }

    const program = new Program(programData);
    await program.save();
    return program;
  }

  static async updateProgram(
    id: string, 
    data: Partial<ProgramInput>, 
    adminId: string, 
    files?: {
      primaryImage?: Express.Multer.File[];
      secondaryImage?: Express.Multer.File[];
    }
  ) {
    const program = await Program.findById(id);
    if (!program) throw new Error('Program not found');

    // Handle Primary Image Replace OR Remove
    if (files?.primaryImage?.[0]) {
      if (program.primaryImage?.publicId) {
        await CloudinaryService.deleteAsset(program.primaryImage.publicId);
      }
      program.primaryImage = await CloudinaryService.uploadBuffer(files.primaryImage[0].buffer, 'programs');
    } else if (data.removePrimaryImage) {
      if (program.primaryImage?.publicId) {
        await CloudinaryService.deleteAsset(program.primaryImage.publicId);
      }
      program.primaryImage = undefined;
    }

    // Handle Secondary Image Replace OR Remove
    if (files?.secondaryImage?.[0]) {
      if (program.secondaryImage?.publicId) {
        await CloudinaryService.deleteAsset(program.secondaryImage.publicId);
      }
      program.secondaryImage = await CloudinaryService.uploadBuffer(files.secondaryImage[0].buffer, 'programs');
    } else if (data.removeSecondaryImage) {
      if (program.secondaryImage?.publicId) {
        await CloudinaryService.deleteAsset(program.secondaryImage.publicId);
      }
      program.secondaryImage = undefined;
    }

    if (data.title) program.title = data.title;
    if (data.shortDescription) program.shortDescription = data.shortDescription;
    if (data.processDescription !== undefined) program.processDescription = data.processDescription || undefined;
    if (data.steps) program.steps = data.steps as any;
    
    if (data.benefits) {
      program.benefits.heading = data.benefits.heading;
      program.benefits.description = data.benefits.description;
    }
    if (data.benefitItems) program.benefitItems = data.benefitItems as any;
    
    if (data.reviewSectionDescription !== undefined) program.reviewSectionDescription = data.reviewSectionDescription || undefined;
    
    if (data.publishStatus) program.publishStatus = data.publishStatus;
    if (data.displayOrder !== undefined) program.displayOrder = data.displayOrder;
    if (data.isFeatured !== undefined) program.isFeatured = data.isFeatured;
    if (data.status) program.status = data.status;
    
    if (data.seo) program.seo = data.seo;

    program.updatedBy = adminId as any;
    await program.save();
    return program;
  }

  static async softDelete(id: string, adminId: string) {
    const program = await Program.findById(id);
    if (!program) throw new Error('Program not found');

    program.deletedAt = new Date();
    program.deletedBy = adminId as any;
    await program.save();
    
    return true;
  }
}
