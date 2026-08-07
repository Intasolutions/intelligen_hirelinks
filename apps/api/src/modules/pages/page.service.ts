import { Page } from './page.model';
import { PageInput } from '@hirelinks/contracts';
import { CloudinaryService } from '../../shared/cloudinary.service';

const ALLOWED_SLUGS = ['privacy-policy', 'terms-conditions'];

export class PageEngine {
  static async getPage(slug: string) {
    if (!ALLOWED_SLUGS.includes(slug)) {
      throw new Error('Invalid page slug');
    }
    
    let page = await Page.findOne({ slug }).lean();
    
    // If it doesn't exist yet, return a blank template so the frontend doesn't crash
    if (!page) {
      page = {
        title: slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms & Conditions',
        slug,
        content: '',
      } as any;
    }
    
    return page;
  }

  static async updatePage(
    slug: string, 
    data: Partial<PageInput>, 
    adminId: string, 
    file?: Express.Multer.File
  ) {
    if (!ALLOWED_SLUGS.includes(slug)) {
      throw new Error('Invalid page slug');
    }

    let page = await Page.findOne({ slug });
    
    if (!page) {
      // Create if it doesn't exist
      page = new Page({ slug, title: data.title || slug, content: '' });
    }

    if (file) {
      if (page.image?.publicId) {
        await CloudinaryService.deleteAsset(page.image.publicId);
      }
      page.image = await CloudinaryService.uploadBuffer(file.buffer, 'pages');
    } else if (data.removeImage) {
      if (page.image?.publicId) {
        await CloudinaryService.deleteAsset(page.image.publicId);
      }
      page.image = undefined;
    }

    if (data.title) page.title = data.title;
    if (data.content !== undefined) page.content = data.content;

    page.updatedBy = adminId as any;
    
    await page.save();
    return page;
  }
}
