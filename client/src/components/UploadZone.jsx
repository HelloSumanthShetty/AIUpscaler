import React from 'react';
import { Upload, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadZone = ({ isDragging, onDragOver, onDragLeave, onDrop, onClick, fileInputRef, onFileChange }) => {
    return (
        <>
            <motion.div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={onClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onFileChange}
                />

                <div className="upload-icon-wrapper">
                    <Upload size={40} />
                </div>

                <h3 className="upload-title">
                    Drop or Click to Upload
                </h3>

                <p className="upload-subtitle">
                    Supports JPG, PNG, WEBP
                </p>

                <button className="btn-primary btn-upload">
                    Upload Image
                </button>
            </motion.div>

            <motion.div
                className="features-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                {[
                    { text: 'Free to use' },
                    { text: 'No account required' },
                    { text: 'Secure & Private' }
                ].map((feature, idx) => (
                    <motion.div
                        key={feature.text}
                        className="feature-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                    >
                        <Check size={18} className="feature-icon" />
                        <span>{feature.text}</span>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
};

export default UploadZone;
