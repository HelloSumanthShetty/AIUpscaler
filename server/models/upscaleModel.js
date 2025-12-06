
import { v2 as cloudinary } from 'cloudinary';

// ------- CLOUDINARY CONFIG -------
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('WARNING: Cloudinary credentials missing from environment variables!');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ------- UPSCALE FUNCTION -------
export const upscaleImage = async (imageBuffer, mimeType, scale) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw new Error('Missing Cloudinary Credentials');
        }

        console.log('[Cloudinary] Uploading image buffer...');

        const b64 = Buffer.from(imageBuffer).toString('base64');
        const dataURI = "data:" + mimeType + ";base64," + b64;

        // For gen_restore with upscaling, we need to use proper transformation syntax
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            resource_type: "image",
            transformation: [
                { effect: "gen_restore" },  // AI enhancement first
                { width: `iw_mul_${scale}`, height: `ih_mul_${scale}`, crop: "scale" }  // Then scale by factor
            ]
        });

        console.log('[Cloudinary] Upload success:', uploadResult.secure_url);

        return {
            url: uploadResult.secure_url,
            width: uploadResult.width,
            height: uploadResult.height,
            fileName: uploadResult.original_filename
        };

    } catch (error) {
        console.error('Cloudinary Ops Error:', error);

        // If gen_restore fails because image is too small (< 64x64), try without it
        if (error.message && error.message.includes('too small for gen_restore')) {
            console.log('[Cloudinary] Image too small for gen_restore, using regular upscale...');
            try {
                const b64 = Buffer.from(imageBuffer).toString('base64');
                const dataURI = "data:" + mimeType + ";base64," + b64;

                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    resource_type: "image",
                    transformation: [
                        { quality: "auto:best" },  // Best quality
                        { width: `iw_mul_${scale}`, height: `ih_mul_${scale}`, crop: "scale" }
                    ]
                });

                return {
                    url: uploadResult.secure_url,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    fileName: uploadResult.original_filename
                };
            } catch (fallbackError) {
                console.error('Cloudinary Fallback Error:', fallbackError);
                throw fallbackError;
            }
        }

        throw error;
    }
};

