import { Review, IReview } from './review.model';
import { ReviewInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';
import { Service } from '../services/service.model';
import { Program } from '../programs/program.model';

export class ReviewService {
  /**
   * List reviews with standard CMS pagination, search, and filters.
   */
  static async listReviews(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    moderationStatus?: string;
    featureOnHomepage?: boolean;
    sort?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IReview> = {};

    if (query.search) {
      filter.$or = [
        { customerName: { $regex: query.search, $options: 'i' } },
        { reviewComment: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.status) filter.status = query.status;
    if (query.moderationStatus) filter.moderationStatus = query.moderationStatus;
    if (query.featureOnHomepage !== undefined) filter.featureOnHomepage = query.featureOnHomepage;

    // Sorting: default to displayOrder ascending, then createdAt descending
    let sortObj: any = { displayOrder: 1, createdAt: -1 };
    if (query.sort === 'newest') sortObj = { createdAt: -1 };
    else if (query.sort === 'oldest') sortObj = { createdAt: 1 };
    else if (query.sort === 'rating_high') sortObj = { rating: -1 };
    else if (query.sort === 'rating_low') sortObj = { rating: 1 };

    const data = await Review.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

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

  static async getPublicReviews() {
    return Review.find({ status: 'ACTIVE', moderationStatus: 'APPROVED' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getFeaturedReviews() {
    return Review.find({ status: 'ACTIVE', moderationStatus: 'APPROVED', featureOnHomepage: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getReviewsByServiceSlug(slug: string) {
    const service = await Service.findOne({ slug, status: 'ACTIVE' }).lean();
    if (!service) return [];

    return Review.find({ 
      linkedType: 'SERVICE', 
      linkedItem: (service as any)._id,
      status: 'ACTIVE', 
      moderationStatus: 'APPROVED' 
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getReviewsByProgramSlug(slug: string) {
    const program = await Program.findOne({ slug, status: 'ACTIVE' }).lean();
    if (!program) return [];

    return Review.find({ 
      linkedType: 'PROGRAM', 
      linkedItem: (program as any)._id,
      status: 'ACTIVE', 
      moderationStatus: 'APPROVED' 
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
  }

  static async getById(id: string) {
    const review = await Review.findById(id).lean();
    if (!review) throw new Error('Review not found');
    return review;
  }

  static async createReview(data: ReviewInput, adminId: string, file?: Express.Multer.File) {
    let customerPhoto;
    
    if (file) {
      customerPhoto = await CloudinaryService.uploadBuffer(file.buffer, 'reviews');
    }

    const review = new Review({
      ...data,
      customerPhoto,
      createdBy: adminId,
      updatedBy: adminId
    });

    await review.save();
    return review;
  }

  static async updateReview(id: string, data: Partial<ReviewInput>, adminId: string, file?: Express.Multer.File) {
    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    if (file) {
      // Delete old photo if it exists
      if (review.customerPhoto?.publicId) {
        await CloudinaryService.deleteAsset(review.customerPhoto.publicId);
      }
      review.customerPhoto = await CloudinaryService.uploadBuffer(file.buffer, 'reviews');
    } else if (data.removeImage) {
      if (review.customerPhoto?.publicId) {
        await CloudinaryService.deleteAsset(review.customerPhoto.publicId);
      }
      review.customerPhoto = undefined;
    }

    Object.assign(review, data);
    review.updatedBy = adminId as any;
    
    await review.save();
    return review;
  }

  static async softDelete(id: string, adminId: string) {
    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    review.deletedAt = new Date();
    review.deletedBy = adminId as any;
    await review.save();
    
    return true;
  }
}
