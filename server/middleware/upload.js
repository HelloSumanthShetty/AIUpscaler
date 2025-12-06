import multer from 'multer';

// Configure Multer for file uploads (store in memory to pass to Cloudinary)
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
