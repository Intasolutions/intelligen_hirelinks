import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME || 'test_cloud',
  api_key: env.CLOUDINARY_API_KEY || 'test_key',
  api_secret: env.CLOUDINARY_API_SECRET || 'test_secret',
});

export class CloudinaryService {
  /**
   * Uploads a file buffer directly to Cloudinary via stream.
   * Does not write to disk.
   */
  static async uploadBuffer(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
    if (env.CLOUDINARY_API_KEY === 'test_key' || !env.CLOUDINARY_API_KEY) {
      console.warn('⚠️ Cloudinary is not configured. Returning a dummy image URL.');
      return {
        url: 'https://placehold.co/600x400/png?text=Dummy+Image',
        publicId: `dummy_${Date.now()}`
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
    if (publicId.startsWith('dummy_') || env.CLOUDINARY_API_KEY === 'test_key' || !env.CLOUDINARY_API_KEY) {
      return; // Do nothing for dummy images or if not configured
    }
    
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary asset: ${publicId}`, error);
    }
  }
}
