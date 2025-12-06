import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { upscaleImage } from '../services/upscaleService';
import { CONFIG } from '../config';
import HeroHeader from './HeroHeader';
import UploadZone from './UploadZone';
import SettingsPanel from './SettingsPanel';
import PreviewArea from './PreviewArea';
import { useAuth } from '../contexts/AuthContext';
import { useImageHistory } from '../hooks/useImageHistory';

const Hero = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [processedUrl, setProcessedUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [upscaleFactor, setUpscaleFactor] = useState(2);
    const [resultData, setResultData] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState(null);

    const fileInputRef = useRef(null);
    const { user, usage, refreshUsage } = useAuth();
    const { addToHistory } = useImageHistory(user?.id);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validateFile = (file) => {
        if (!CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
            toast.error('Unsupported file format. Please use JPG, PNG, or WEBP.');
            return false;
        }
        if (file.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast.error(`File size exceeds ${CONFIG.MAX_FILE_SIZE_MB}MB limit.`);
            return false;
        }
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                const url = URL.createObjectURL(droppedFile);
                setPreviewUrl(url);
                setProcessedUrl(null);

                const img = new Image();
                img.onload = () => {
                    setOriginalDimensions({ width: img.width, height: img.height });
                };
                img.src = url;
            }
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                const url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
                setProcessedUrl(null);

                const img = new Image();
                img.onload = () => {
                    setOriginalDimensions({ width: img.width, height: img.height });
                };
                img.src = url;
            }
        }
    };

    const handleUpscale = async () => {
        if (!file) return;

        // Check usage limit
        if (usage && usage.remaining <= 0) {
            toast.error('Daily upload limit reached. Try again tomorrow!');
            return;
        }

        setIsProcessing(true);
        const toastId = toast.loading('Enhancing your image...');

        try {
            const result = await upscaleImage(file, upscaleFactor);

            setProcessedUrl(result.url);
            setResultData({
                width: result.resultWidth,
                height: result.resultHeight,
                fileName: result.fileName
            });

            // Add to history (only save permanent URLs, not blob URLs)
            addToHistory({
                originalUrl: file.name, // Store filename instead of blob URL
                enhancedUrl: result.url, // This is the permanent Cloudinary URL
                originalSize: ((file.size / 1024).toFixed(2) + ' KB'),
                resultWidth: result.resultWidth,
                resultHeight: result.resultHeight,
                scale: upscaleFactor
            });

            // Refresh usage data
            await refreshUsage();

            toast.success('Image enhanced successfully!', { id: toastId });
        } catch (err) {
            console.error('Upscale error:', err);
            toast.error(err.message || 'Upscaling failed', { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!processedUrl) return;

        try {
            const toastId = toast.loading('Preparing download...');
            const response = await fetch(processedUrl);

            if (!response.ok) {
                const proxyUrl = `${CONFIG.API_URL}/download?url=${encodeURIComponent(processedUrl)}`;
                const proxyResponse = await fetch(proxyUrl);

                if (!proxyResponse.ok) {
                    toast.error('Download failed. Server could not fetch image.', { id: toastId });
                    return;
                }

                const blob = await proxyResponse.blob();
                triggerDownload(blob, toastId);
                return;
            }

            const blob = await response.blob();
            triggerDownload(blob, toastId);
        } catch (err) {
            console.error("Download error", err);
            toast.error('Download failed. ' + err.message);
        }
    };

    const triggerDownload = (blob, toastId) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // Use original filename with '-upscaled' suffix
        let downloadName = 'upscaled-image.png';
        if (file && file.name) {
            const nameParts = file.name.split('.');
            const ext = nameParts.pop();
            const baseName = nameParts.join('.');
            downloadName = `${baseName}-upscaled.${ext}`;
        }

        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        if (toastId) toast.dismiss(toastId);
        toast.success('Download started');
    };

    const resetUpload = () => {
        setFile(null);
        setPreviewUrl(null);
        setProcessedUrl(null);
        setResultData(null);
        setOriginalDimensions(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <section className="hero-section">
            <AnimatePresence mode="wait">
                {!previewUrl ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="hero-content"
                    >
                        <HeroHeader />

                        <UploadZone
                            isDragging={isDragging}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            fileInputRef={fileInputRef}
                            onFileChange={handleFileSelect}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                        className="processing-container"
                    >
                        <div className="processing-header">
                            <h2 className="text-xl font-bold font-display ml-2">
                                {processedUrl ? 'Upscaling Complete' : 'Configure Upscaling'}
                            </h2>
                            <button
                                onClick={resetUpload}
                                className="close-btn"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="workspace-grid">
                            <div>
                                <SettingsPanel
                                    upscaleFactor={upscaleFactor}
                                    setUpscaleFactor={setUpscaleFactor}
                                    isProcessing={isProcessing}
                                    processedUrl={processedUrl}
                                    file={file}
                                    originalDimensions={originalDimensions}
                                    resultData={resultData}
                                    onUpscale={handleUpscale}
                                    onDownload={handleDownload}
                                />
                            </div>

                            <div>
                                <PreviewArea
                                    processedUrl={processedUrl}
                                    previewUrl={previewUrl}
                                    isProcessing={isProcessing}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default Hero;
