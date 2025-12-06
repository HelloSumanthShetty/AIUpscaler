// LocalStorage utility for image history with user-specific storage
const STORAGE_KEY_PREFIX = 'image_upscale_history';
const MAX_HISTORY_ITEMS = 20; // Limit to prevent localStorage from getting too large

// Get storage key for current user
const getStorageKey = (userId = null) => {
    if (userId) {
        return `${STORAGE_KEY_PREFIX}_user_${userId}`;
    }
    return `${STORAGE_KEY_PREFIX}_guest`;
};

export const saveImageToHistory = (imageData, userId = null) => {
    try {
        const storageKey = getStorageKey(userId);
        const history = getImageHistory(userId);

        // Add new item to the beginning
        const newItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            originalUrl: imageData.originalUrl,
            enhancedUrl: imageData.enhancedUrl,
            originalSize: imageData.originalSize,
            resultWidth: imageData.resultWidth,
            resultHeight: imageData.resultHeight,
            scale: imageData.scale || 2,
            userId: userId || 'guest' // Track who uploaded
        };

        history.unshift(newItem);

        // Keep only the most recent items
        const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(storageKey, JSON.stringify(trimmedHistory));

        return newItem;
    } catch (error) {
        console.error('Error saving to history:', error);
        // If localStorage is full, try clearing old items
        if (error.name === 'QuotaExceededError') {
            clearOldHistory(userId);
            return saveImageToHistory(imageData, userId);
        }
        return null;
    }
};

export const getImageHistory = (userId = null) => {
    try {
        const storageKey = getStorageKey(userId);
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
};

export const clearImageHistory = (userId = null) => {
    try {
        const storageKey = getStorageKey(userId);
        localStorage.removeItem(storageKey);
        return true;
    } catch (error) {
        console.error('Error clearing history:', error);
        return false;
    }
};

export const removeImageFromHistory = (id, userId = null) => {
    try {
        const storageKey = getStorageKey(userId);
        const history = getImageHistory(userId);
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error removing from history:', error);
        return false;
    }
};

const clearOldHistory = (userId = null) => {
    try {
        const storageKey = getStorageKey(userId);
        const history = getImageHistory(userId);
        // Keep only the 5 most recent items
        const trimmed = history.slice(0, 5);
        localStorage.setItem(storageKey, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Error clearing old history:', error);
    }
};

// Get storage usage info
export const getStorageInfo = (userId = null) => {
    try {
        const history = getImageHistory(userId);
        const dataSize = new Blob([JSON.stringify(history)]).size;
        return {
            itemCount: history.length,
            sizeInBytes: dataSize,
            sizeInMB: (dataSize / (1024 * 1024)).toFixed(2)
        };
    } catch (error) {
        return { itemCount: 0, sizeInBytes: 0, sizeInMB: '0.00' };
    }
};
