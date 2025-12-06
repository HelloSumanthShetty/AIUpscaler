import express from 'express';
import { handleUpscale, handleDownload } from '../controllers/upscaleController.js';
import { upload } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Upscale route with optional auth (works with or without login)
router.post('/upscale', optionalAuth, upload.single('image'), handleUpscale);

// Download route
router.get('/download', handleDownload);

export default router;
