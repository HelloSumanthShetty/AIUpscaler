import React from 'react';
import ComparisonSlider from './ComparisonSlider';

const PreviewArea = ({ processedUrl, previewUrl, isProcessing }) => {
    if (processedUrl) {
        return (
            <ComparisonSlider
                originalImage={previewUrl}
                resultImage={processedUrl}
            />
        );
    }

    return (
        <div className="preview-area">
            <img
                src={previewUrl}
                alt="Preview"
                className="preview-img"
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
            />
            {isProcessing && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <h3 className="loading-text">Enhancing Image...</h3>
                    <p className="mt-2 text-gray-400 font-medium">Please wait while our AI works its magic</p>
                </div>
            )}
        </div>
    );
};

export default PreviewArea;
