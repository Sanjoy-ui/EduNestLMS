import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure temporary upload directory exists
const tempDir = './tmp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images (Thumbnails, Profile photos)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed!'), false);
  }
};

// File filter for videos (Lecture videos)
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, MOV, AVI, WEBM, MKV) are allowed!'), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit for images
});

export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB limit for videos
});

export default { uploadImage, uploadVideo };
