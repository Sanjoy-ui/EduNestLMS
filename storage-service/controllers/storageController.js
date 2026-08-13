import { uploadImageToCloudinary, uploadVideoToCloudinary, deleteFromCloudinary } from '../configs/cloudinary.js';

/**
 * Handle Image Uploads (Thumbnails & Profile Photos)
 */
export const uploadImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const folder = req.body.folder || 'thumbnails';
    const uploadResult = await uploadImageToCloudinary(req.file.path, folder);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to CDN',
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      metadata: {
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    });
  } catch (error) {
    console.error('Upload Image Controller Error:', error);
    return res.status(500).json({ success: false, message: `Image upload failed: ${error.message}` });
  }
};

/**
 * Handle Lecture Video Uploads (Multi-resolution 144p to 1080p CDN Streaming)
 */
export const uploadVideoHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const folder = req.body.folder || 'lectures';
    const uploadResult = await uploadVideoToCloudinary(req.file.path, folder);

    return res.status(200).json({
      success: true,
      message: 'Video uploaded successfully to CDN with multi-resolution streaming support',
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      duration: uploadResult.duration,
      resolutions: uploadResult.resolutions, // 1080p, 720p, 480p, 360p, 240p, 144p
      metadata: {
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    });
  } catch (error) {
    console.error('Upload Video Controller Error:', error);
    return res.status(500).json({ success: false, message: `Video upload failed: ${error.message}` });
  }
};

/**
 * Handle Asset Deletion from CDN
 */
export const deleteAssetHandler = async (req, res) => {
  try {
    const { publicId, resourceType } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }

    const result = await deleteFromCloudinary(publicId, resourceType || 'image');
    return res.status(200).json({
      success: true,
      message: 'Asset removed from Cloudinary CDN',
      result
    });
  } catch (error) {
    console.error('Delete Asset Controller Error:', error);
    return res.status(500).json({ success: false, message: `Asset deletion failed: ${error.message}` });
  }
};

/**
 * Health check endpoint
 */
export const healthCheckHandler = (req, res) => {
  return res.status(200).json({
    status: 'healthy',
    service: 'storage-service',
    timestamp: new Date().toISOString()
  });
};
