import { CONFIG } from '../config';

/**
 * Upscales an image using the local backend server (which calls Cloudinary).
 * 
 * @param {File} file - The image file to upscale
 * @param {number} factor - The upscale factor (2 or 4)
 * @returns {Promise<{url: string, width: number, height: number}>}
 */
export const upscaleImage = async (file, factor) => {
    // Validate file before sending
    if (!CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
        throw new Error("Unsupported file format");
    }

    if (file.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(`File too large. Max size is ${CONFIG.MAX_FILE_SIZE_MB}MB`);
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('scale', factor);

    try {
        const response = await fetch(`${CONFIG.API_URL}/upscale`, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Include cookies for auth if logged in
        });

        const data = await response.json();

        if (!response.ok) {
            // Check for usage limit error
            if (response.status === 429) {
                throw new Error(data.message || 'Daily upload limit reached');
            }

            // Check for API limits or payment issues
            if (data.details && (
                data.details.includes('402') ||
                data.details.includes('429') ||
                data.details.includes('Insufficient credit') ||
                data.details.includes('throttled')
            )) {
                console.warn("API Limit/Credit reached. Falling back to mock mode.");
                return mockUpscale(file, factor);
            }

            // If server is missing Cloudinary credentials
            if (data.details && (data.details.includes('Missing API Key') || data.details.includes('Missing Cloudinary Credentials'))) {
                throw new Error("Server configuration error. Please contact support.");
            }

            // Handle specific HTTP error codes with user-friendly messages
            if (response.status === 429) {
                throw new Error('Daily upload limit reached. Please try again tomorrow or sign in for more uploads!');
            }
            if (response.status === 413) {
                throw new Error('Image file is too large. Please use an image under 10MB.');
            }
            if (response.status === 415) {
                throw new Error('Unsupported file type. Please use JPG, PNG, or WEBP format.');
            }
            if (response.status === 401) {
                throw new Error('Please sign in to continue uploading images.');
            }
            if (response.status === 500) {
                throw new Error('Server error occurred. Please try again in a moment.');
            }

            throw new Error(data.details || data.error || "Failed to enhance image. Please try again.");
        }

        return {
            url: data.url,
            originalSize: (file.size / 1024).toFixed(2) + ' KB',
            originalWidth: 0,
            originalHeight: 0,
            resultWidth: data.resultWidth || 0,
            resultHeight: data.resultHeight || 0,
            fileName: data.fileName,
            usage: data.usage // May be null if not logged in
        };

    } catch (error) {
        // Fallback to mock if server is not running
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.warn("Backend server not reachable. Falling back to mock mode.");
            return mockUpscale(file, factor);
        }

        // Re-throw error with user-friendly message
        throw new Error(error.message || 'Something went wrong. Please try again.');
    }
};

// Mock fallback for demonstration
const mockUpscale = (file, factor) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url: CONFIG.MOCK_RESULT_IMAGE,
                originalSize: (file.size / 1024).toFixed(2) + ' KB',
                originalWidth: 800,
                originalHeight: 600,
                resultWidth: 800 * factor,
                resultHeight: 600 * factor
            });
        }, 2000);
    });
};
