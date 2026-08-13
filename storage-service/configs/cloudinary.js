import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Helper to ensure Cloudinary configuration is fresh and loaded from process.env
const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

/**
 * Upload Image to Cloudinary CDN (Profile photos, Course thumbnails)
 */
export const uploadImageToCloudinary = async (filePath, folder = 'images') => {
  try {
    if (!filePath) return null;
    initCloudinary();

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `edunest-lms/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' } // CDN Auto optimization
      ]
    });

    // Cleanup local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload Video to Cloudinary CDN with Multi-Resolution Streaming Profiles
 * (Supports 1080p, 720p, 480p, 360p, 240p, 144p resolution profiles + HLS adaptive streaming)
 */
export const uploadVideoToCloudinary = async (filePath, folder = 'videos') => {
  try {
    if (!filePath) return null;
    initCloudinary();

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `edunest-lms/${folder}`,
      resource_type: 'video',
      eager: [
        // 1080p (Full HD)
        { width: 1920, height: 1080, crop: 'fit', quality: 'auto', format: 'mp4' },
        // 720p (HD)
        { width: 1280, height: 720, crop: 'fit', quality: 'auto', format: 'mp4' },
        // 480p (SD)
        { width: 854, height: 480, crop: 'fit', quality: 'auto', format: 'mp4' },
        // 360p
        { width: 640, height: 360, crop: 'fit', quality: 'auto', format: 'mp4' },
        // 240p
        { width: 426, height: 240, crop: 'fit', quality: 'auto', format: 'mp4' },
        // 144p (Low Bandwidth)
        { width: 256, height: 144, crop: 'fit', quality: 'auto', format: 'mp4' }
      ],
      eager_async: true // Transcode resolutions asynchronously in background on Cloudinary CDN
    });

    // Cleanup local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Generate dynamic multi-resolution URL helper map for player options
    const resolutions = {
      original: result.secure_url,
      '1080p': cloudinary.url(result.public_id, { resource_type: 'video', width: 1920, height: 1080, crop: 'fit', quality: 'auto', format: 'mp4' }),
      '720p': cloudinary.url(result.public_id, { resource_type: 'video', width: 1280, height: 720, crop: 'fit', quality: 'auto', format: 'mp4' }),
      '480p': cloudinary.url(result.public_id, { resource_type: 'video', width: 854, height: 480, crop: 'fit', quality: 'auto', format: 'mp4' }),
      '360p': cloudinary.url(result.public_id, { resource_type: 'video', width: 640, height: 360, crop: 'fit', quality: 'auto', format: 'mp4' }),
      '240p': cloudinary.url(result.public_id, { resource_type: 'video', width: 426, height: 240, crop: 'fit', quality: 'auto', format: 'mp4' }),
      '144p': cloudinary.url(result.public_id, { resource_type: 'video', width: 256, height: 144, crop: 'fit', quality: 'auto', format: 'mp4' })
    };

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
      bytes: result.bytes,
      resolutions
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete File from Cloudinary CDN
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    initCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Error deleting asset from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
