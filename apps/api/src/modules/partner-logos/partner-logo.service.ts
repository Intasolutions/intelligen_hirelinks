import { PartnerLogo, IPartnerLogo } from './partner-logo.model';
import { PartnerLogoInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';

export class PartnerLogoService {
  /**
   * List partner logos with standard CMS pagination, search, and filters.
   */
  static async listPartnerLogos(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IPartnerLogo> = {};

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;

    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (query.sort === 'newest') sortObj = { createdAt: -1 };
    else if (query.sort === 'oldest') sortObj = { createdAt: 1 };

    const data = await PartnerLogo.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PartnerLogo.countDocuments(filter);

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

  static async getPublicPartnerLogos(category?: string) {
    const filter: FilterQuery<IPartnerLogo> = { status: 'ACTIVE' };
    if (category) filter.category = category;

    return PartnerLogo.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    const partnerLogo = await PartnerLogo.findById(id).lean();
    if (!partnerLogo) throw new Error('Partner logo not found');
    return partnerLogo;
  }

  static async createPartnerLogo(data: PartnerLogoInput, adminId: string, file?: Express.Multer.File) {
    let logo;

    if (file) {
      logo = await CloudinaryService.uploadBuffer(file.buffer, 'partner-logos');
    }

    const partnerLogo = new PartnerLogo({
      ...data,
      logo,
      createdBy: adminId,
      updatedBy: adminId
    });

    await partnerLogo.save();
    return partnerLogo;
  }

  static async updatePartnerLogo(id: string, data: Partial<PartnerLogoInput>, adminId: string, file?: Express.Multer.File) {
    const partnerLogo = await PartnerLogo.findById(id);
    if (!partnerLogo) throw new Error('Partner logo not found');

    if (file) {
      if (partnerLogo.logo?.publicId) {
        await CloudinaryService.deleteAsset(partnerLogo.logo.publicId);
      }
      partnerLogo.logo = await CloudinaryService.uploadBuffer(file.buffer, 'partner-logos');
    } else if (data.removeLogo) {
      if (partnerLogo.logo?.publicId) {
        await CloudinaryService.deleteAsset(partnerLogo.logo.publicId);
      }
      partnerLogo.logo = undefined;
    }

    Object.assign(partnerLogo, data);
    partnerLogo.updatedBy = adminId as any;

    await partnerLogo.save();
    return partnerLogo;
  }

  static async softDelete(id: string, adminId: string) {
    const partnerLogo = await PartnerLogo.findById(id);
    if (!partnerLogo) throw new Error('Partner logo not found');

    partnerLogo.deletedAt = new Date();
    partnerLogo.deletedBy = adminId as any;
    await partnerLogo.save();

    return true;
  }
}
