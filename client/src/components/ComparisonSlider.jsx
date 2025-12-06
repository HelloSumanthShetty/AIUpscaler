import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

const ComparisonSlider = ({ originalImage, resultImage, originalLabel = "Original", resultLabel = "Upscaled" }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (e) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    const handleTouchMove = (e) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="comparison-slider"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Result Image (Background) */}
            <div className="slider-img-wrapper">
                <img
                    src={resultImage}
                    alt={resultLabel}
                    className="slider-img"
                    onError={(e) => {
                        console.error('Failed to load result image:', resultImage);
                        e.target.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
                        e.target.style.display = 'flex';
                        e.target.style.alignItems = 'center';
                        e.target.style.justifyContent = 'center';
                        e.target.alt = '❌ Failed to load image';
                    }}
                    onLoad={() => {
                        console.log('Result image loaded successfully:', resultImage);
                    }}
                />
            </div>

            {/* Result Label */}
            <div className="slider-label label-right">
                {resultLabel}
            </div>

            {/* Original Image (Foreground - Clipped) */}
            <div
                className="slider-clipper"
                style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    borderRight: 'none' // Handled by slider handle line or keep as is? CSS has border-right.
                }}
            >
                <div className="slider-img-wrapper">
                    <img
                        src={originalImage}
                        alt={originalLabel}
                        className="slider-img"
                        onError={(e) => {
                            console.error('Failed to load original image:', originalImage);
                            e.target.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
                            e.target.alt = '❌ Failed to load image';
                        }}
                        onLoad={() => {
                            console.log('Original image loaded successfully:', originalImage);
                        }}
                    />
                </div>

                {/* Original Label */}
                <div className="slider-label label-left">
                    {originalLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="slider-handle-container"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="slider-handle">
                    <MoveHorizontal size={20} />
                </div>
            </div>
        </div>
    );
};

export default ComparisonSlider;
