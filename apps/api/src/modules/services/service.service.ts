import { Service, IService } from './service.model';
import { ServiceInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';
import slugify from 'slugify';

export class ServiceEngine {
  static async listServices(query: {
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

    const filter: FilterQuery<IService> = {};

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

    const data = await Service.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Service.countDocuments(filter);

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

  static async getPublicServices() {
    return Service.find({ status: 'ACTIVE', publishStatus: 'PUBLISHED' })
      .sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    const service = await Service.findById(id).lean();
    if (!service) throw new Error('Service not found');
    return service;
  }

  static async getBySlug(slug: string) {
    const service = await Service.findOne({ slug, status: 'ACTIVE', publishStatus: 'PUBLISHED' }).lean();
    if (!service) throw new Error('Service not found');
    return service;
  }

  static async createService(
    data: ServiceInput, 
    adminId: string, 
    files?: {
      primaryImage?: Express.Multer.File[];
      secondaryImage?: Express.Multer.File[];
    }
  ) {
    let primaryImage, secondaryImage;
    
    if (files?.primaryImage?.[0]) {
      primaryImage = await CloudinaryService.uploadBuffer(files.primaryImage[0].buffer, 'services');
    }
    if (files?.secondaryImage?.[0]) {
      secondaryImage = await CloudinaryService.uploadBuffer(files.secondaryImage[0].buffer, 'services');
    }

    const serviceData: any = {
      ...data,
      primaryImage,
      secondaryImage,
      createdBy: adminId,
      updatedBy: adminId
    };

    // Auto-generate slug if not provided, though pre-validate hook also handles this
    if (!serviceData.slug) {
      serviceData.slug = slugify(data.title, { lower: true, strict: true });
    }

    const service = new Service(serviceData);
    await service.save();
    return service;
  }

  static async updateService(
    id: string, 
    data: Partial<ServiceInput>, 
    adminId: string, 
    files?: {
      primaryImage?: Express.Multer.File[];
      secondaryImage?: Express.Multer.File[];
    }
  ) {
    const service = await Service.findById(id);
    if (!service) throw new Error('Service not found');

    if (files?.primaryImage?.[0]) {
      if (service.primaryImage?.publicId) {
        await CloudinaryService.deleteAsset(service.primaryImage.publicId);
      }
      service.primaryImage = await CloudinaryService.uploadBuffer(files.primaryImage[0].buffer, 'services');
    }

    if (files?.secondaryImage?.[0]) {
      if (service.secondaryImage?.publicId) {
        await CloudinaryService.deleteAsset(service.secondaryImage.publicId);
      }
      service.secondaryImage = await CloudinaryService.uploadBuffer(files.secondaryImage[0].buffer, 'services');
    }

    // Assign primitive and array fields
    if (data.title) service.title = data.title;
    if (data.shortDescription) service.shortDescription = data.shortDescription;
    if (data.processDescription !== undefined) service.processDescription = data.processDescription || undefined;
    if (data.steps) service.steps = data.steps as any;
    
    if (data.benefits) {
      service.benefits.heading = data.benefits.heading;
      service.benefits.description = data.benefits.description;
    }
    if (data.benefitItems) service.benefitItems = data.benefitItems as any;
    
    if (data.reviewSectionDescription !== undefined) service.reviewSectionDescription = data.reviewSectionDescription || undefined;
    
    if (data.publishStatus) service.publishStatus = data.publishStatus;
    if (data.displayOrder !== undefined) service.displayOrder = data.displayOrder;
    if (data.isFeatured !== undefined) service.isFeatured = data.isFeatured;
    if (data.status) service.status = data.status;
    
    if (data.seo) service.seo = data.seo;

    service.updatedBy = adminId as any;
    await service.save();
    return service;
  }

  static async softDelete(id: string, adminId: string) {
    const service = await Service.findById(id);
    if (!service) throw new Error('Service not found');

    service.deletedAt = new Date();
    service.deletedBy = adminId as any;
    await service.save();
    
    return true;
  }
}
