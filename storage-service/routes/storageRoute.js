import express from 'express';
import { uploadImage, uploadVideo } from '../middlewares/multer.js';
import {
  uploadImageHandler,
  uploadVideoHandler,
  deleteAssetHandler,
  healthCheckHandler
} from '../controllers/storageController.js';

const storageRouter = express.Router();

// Health Check
storageRouter.get('/healthz', healthCheckHandler);

// Upload Endpoints
storageRouter.post('/upload/image', uploadImage.single('file'), uploadImageHandler);
storageRouter.post('/upload/video', uploadVideo.single('file'), uploadVideoHandler);

// Delete Endpoint
storageRouter.post('/delete', deleteAssetHandler);

export default storageRouter;
