import { useState, useEffect } from 'react';
import {
    getImageHistory,
    saveImageToHistory,
    removeImageFromHistory,
    clearImageHistory,
    getStorageInfo
} from '../utils/imageHistory';

export const useImageHistory = (userId = null) => {
    const [history, setHistory] = useState([]);
    const [storageInfo, setStorageInfo] = useState({ itemCount: 0, sizeInMB: '0.00' });

    // Load history on mount and when userId changes
    useEffect(() => {
        loadHistory();
    }, [userId]);

    const loadHistory = () => {
        const data = getImageHistory(userId);
        setHistory(data);
        setStorageInfo(getStorageInfo(userId));
    };

    const addToHistory = (imageData) => {
        const newItem = saveImageToHistory(imageData, userId);
        if (newItem) {
            loadHistory(); // Refresh the history
            return newItem;
        }
        return null;
    };

    const removeFromHistory = (id) => {
        const success = removeImageFromHistory(id, userId);
        if (success) {
            loadHistory();
        }
        return success;
    };

    const clearHistory = () => {
        const success = clearImageHistory(userId);
        if (success) {
            loadHistory();
        }
        return success;
    };

    return {
        history,
        storageInfo,
        addToHistory,
        removeFromHistory,
        clearHistory,
        refreshHistory: loadHistory
    };
};
