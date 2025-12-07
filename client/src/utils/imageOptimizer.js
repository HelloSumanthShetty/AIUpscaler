export const optimizeCloudinaryUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const {
        width = 800,
        quality = 'auto',
        format = 'auto',
        blur = false
    } = options;

    const transformations = [
        `w_${width}`,
        `q_${quality}`,
        `f_${format}`,
        blur ? 'e_blur:1000' : null
    ].filter(Boolean).join(',');

    return url.replace('/upload/', `/upload/${transformations}/`);
};

export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};
