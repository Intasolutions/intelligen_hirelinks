import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

import fs from 'fs';
import path from 'path';

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME || 'test_cloud',
    api_key: env.CLOUDINARY_API_KEY || 'test_key',
    api_secret: env.CLOUDINARY_API_SECRET || 'test_secret',
  });
}

export class CloudinaryService {
  /**
   * Uploads a file buffer directly to Cloudinary via stream.
   * If Cloudinary is not configured, saves locally in public/uploads.
   */
  static async uploadBuffer(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
    const isMocked = !process.env.CLOUDINARY_URL && (!env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY === 'test_key');
    
    if (isMocked) {
      if (env.NODE_ENV === 'production') {
        throw new Error('Cloudinary is not configured! Uploads are disabled in production without Cloudinary credentials.');
      }
      
      console.warn('⚠️ Cloudinary is not configured. Saving image locally.');
      
      const fileName = `local_${Date.now()}_${Math.round(Math.random() * 1000)}.jpg`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadsDir, fileName);
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, buffer);
      
      // We assume API runs on port 5000 in dev
      const port = process.env.PORT || 5000;
      return {
        url: `http://localhost:${port}/uploads/${fileName}`,
        publicId: `local_${fileName}`
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `hirelinks/${folder}` },
        (error, result) => {
          if (error) return reject(error);
          if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('Unknown Cloudinary Error'));
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  /**
   * Deletes an asset from Cloudinary by its public ID.
   */
  static async deleteAsset(publicId: string): Promise<void> {
    const isMocked = !process.env.CLOUDINARY_URL && (!env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY === 'test_key');
    
    if (publicId.startsWith('dummy_') || publicId.startsWith('local_')) {
      if (publicId.startsWith('local_')) {
        const fileName = publicId.replace('local_', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return; // Do nothing else for local/dummy images
    }
    
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
    }
  }
}
