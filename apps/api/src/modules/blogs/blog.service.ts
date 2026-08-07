import { Blog, IBlog } from './blog.model';
import { BlogInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { FilterQuery } from 'mongoose';
import slugify from 'slugify';

export class BlogEngine {
  static async listBlogs(query: {
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

    const filter: FilterQuery<IBlog> = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { subTitle: { $regex: query.search, $options: 'i' } },
        { excerpt: { $regex: query.search, $options: 'i' } },
        { tags: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.status) filter.status = query.status;
    if (query.publishStatus) filter.publishStatus = query.publishStatus;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    let sortObj: any = { createdAt: -1 };
    if (query.sort === 'newest') sortObj = { publishedAt: -1, createdAt: -1 };
    else if (query.sort === 'oldest') sortObj = { publishedAt: 1, createdAt: 1 };
    else if (query.sort === 'order') sortObj = { displayOrder: 1, createdAt: -1 };

    const data = await Blog.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);

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

  static async getPublicBlogs(query: { page?: number; limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const filter = { status: 'ACTIVE', publishStatus: 'PUBLISHED' };

    const data = await Blog.find(filter)
      .sort({ publishedAt: -1, displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Blog.countDocuments(filter);
    
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

  static async getById(id: string) {
    const blog = await Blog.findById(id).lean();
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  static async getBySlug(slug: string) {
    const blog = await Blog.findOne({ slug, status: 'ACTIVE', publishStatus: 'PUBLISHED' }).lean();
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  static async createBlog(
    data: BlogInput, 
    adminId: string, 
    file?: Express.Multer.File
  ) {
    let image;
    
    if (file) {
      image = await CloudinaryService.uploadBuffer(file.buffer, 'blogs');
    }

    const blogData: any = {
      ...data,
      image,
      createdBy: adminId,
      updatedBy: adminId
    };

    if (!blogData.slug) {
      blogData.slug = slugify(data.title, { lower: true, strict: true });
    }

    const blog = new Blog(blogData);
    await blog.save();
    return blog;
  }

  static async updateBlog(
    id: string, 
    data: Partial<BlogInput>, 
    adminId: string, 
    file?: Express.Multer.File
  ) {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');

    if (file) {
      if (blog.image?.publicId) {
        await CloudinaryService.deleteAsset(blog.image.publicId);
      }
      blog.image = await CloudinaryService.uploadBuffer(file.buffer, 'blogs');
    } else if (data.removeImage) {
      if (blog.image?.publicId) {
        await CloudinaryService.deleteAsset(blog.image.publicId);
      }
      blog.image = undefined;
    }

    if (data.title) blog.title = data.title;
    if (data.subTitle !== undefined) blog.subTitle = data.subTitle || undefined;
    if (data.excerpt) blog.excerpt = data.excerpt;
    if (data.content) blog.content = data.content;
    if (data.tags) blog.tags = data.tags;
    
    if (data.publishStatus) blog.publishStatus = data.publishStatus;
    if (data.displayOrder !== undefined) blog.displayOrder = data.displayOrder;
    if (data.isFeatured !== undefined) blog.isFeatured = data.isFeatured;
    if (data.status) blog.status = data.status;
    
    if (data.seo) blog.seo = data.seo;

    blog.updatedBy = adminId as any;
    
    if (blog.isModified('publishStatus') && blog.publishStatus === 'PUBLISHED' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    
    await blog.save();
    return blog;
  }

  static async softDelete(id: string, adminId: string) {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');

    blog.deletedAt = new Date();
    blog.deletedBy = adminId as any;
    await blog.save();
    
    return true;
  }

  static async restore(id: string, adminId: string) {
    const blog = await Blog.findOne({ _id: id, deletedAt: { $ne: null } });
    if (!blog) throw new Error('Blog not found or not deleted');

    blog.deletedAt = undefined;
    blog.deletedBy = undefined;
    blog.updatedBy = adminId as any;
    await blog.save();
    
    return blog;
  }
}
