import { upscaleImage } from '../models/upscaleModel.js';
import { incrementUsage, hasExceededLimit, getUserUsage } from '../utils/usageTracker.js';

export const handleUpscale = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const scale = req.body.scale || 2;
        const user = req.user; // May be null if not logged in

        // If user is logged in, check usage limits
        if (user && hasExceededLimit(user.email, 10)) {
            return res.status(429).json({
                error: 'Daily upload limit reached',
                message: 'You have reached your daily limit of 10 uploads. Please try again tomorrow.'
            });
        }

        console.log('Upscaling image. User:', user?.email || 'anonymous', 'Scale:', scale);

        // Pass buffer handling to the model
        const output = await upscaleImage(req.file.buffer, req.file.mimetype, scale);

        console.log('Upscale success:', output);

        // If user is logged in, increment usage
        let usage = null;
        if (user) {
            const updatedUsage = incrementUsage(user.email, user.name);
            usage = {
                count: updatedUsage.count,
                limit: 10,
                remaining: Math.max(0, 10 - updatedUsage.count)
            };
            console.log('Usage updated:', usage);
        }

        res.json({
            success: true,
            url: output.url,
            originalSize: req.file.size,
            resultWidth: output.width,
            resultHeight: output.height,
            fileName: output.fileName,
            usage: usage // Will be null if not logged in
        });

    } catch (error) {
        console.error('Upscaling Controller Error:', error);
        console.error('Error Stack:', error.stack);

        let status = 500;
        let message = error.message || 'Upscaling failed';

        if (error.message.includes('Missing Cloudinary Credentials')) {
            message = 'Server missing Cloudinary credentials';
        }

        res.status(status).json({
            error: 'Upscaling failed',
            details: message,
            status: status
        });
    }
};

export const handleDownload = async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url) {
            return res.status(400).send('Missing URL');
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');

        const buffer = await response.arrayBuffer();
        const bufferData = Buffer.from(buffer);

        const downloadName = filename ? filename : 'upscaled-image.png';

        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png');
        res.send(bufferData);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Failed to download image');
    }
};
