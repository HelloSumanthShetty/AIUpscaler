import React from 'react';
import { Zap, Download, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPanel = ({
    upscaleFactor,
    setUpscaleFactor,
    isProcessing,
    processedUrl,
    file,
    originalDimensions,
    resultData,
    onUpscale,
    onDownload
}) => {
    // Scale options based on Cloudinary capabilities
    const scaleOptions = [
        { value: 2, label: '2x', description: 'Double Resolution', color: '#667eea' },
        { value: 3, label: '3x', description: 'Triple Resolution', color: '#f093fb' },
        { value: 4, label: '4x', description: 'Max Enhancement', color: '#4facfe' }
    ];

    const getFileType = () => {
        if (!file) return '';
        const type = file.type.split('/')[1].toUpperCase();
        return type === 'JPEG' ? 'JPG' : type;
    };

    const calculateIncrease = () => {
        if (!resultData || !originalDimensions) return 0;
        const originalPixels = originalDimensions.width * originalDimensions.height;
        const newPixels = resultData.width * resultData.height;
        return Math.round((newPixels / originalPixels - 1) * 100);
    };

    return (
        <div className="glass-panel settings-panel" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Gradient background accent */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <Sparkles size={20} className="text-gradient" />
                    <h3 className="text-lg font-semibold" style={{ margin: 0 }}>Enhancement Settings</h3>
                </div>

                <div className="settings-group">
                    {/* Scale Options */}
                    <div>
                        <label className="settings-label" style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            marginBottom: '0.75rem',
                            display: 'block',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Upscale Factor
                        </label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.75rem'
                        }}>
                            {scaleOptions.map((option) => (
                                <motion.button
                                    key={option.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setUpscaleFactor(option.value)}
                                    disabled={isProcessing || processedUrl}
                                    style={{
                                        position: 'relative',
                                        padding: '1rem 0.5rem',
                                        borderRadius: '12px',
                                        border: upscaleFactor === option.value
                                            ? `2px solid ${option.color}`
                                            : '2px solid rgba(255,255,255,0.1)',
                                        background: upscaleFactor === option.value
                                            ? `${option.color}20`
                                            : 'rgba(255,255,255,0.03)',
                                        cursor: isProcessing || processedUrl ? 'not-allowed' : 'pointer',
                                        opacity: isProcessing || processedUrl ? 0.5 : 1,
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: upscaleFactor === option.value ? option.color : 'var(--color-text-primary)',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {option.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-text-muted)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {option.description}
                                    </div>
                                    {upscaleFactor === option.value && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            style={{
                                                position: 'absolute',
                                                bottom: '-2px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '50%',
                                                height: '3px',
                                                background: option.color,
                                                borderRadius: '3px 3px 0 0'
                                            }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Image Information */}
                    <div style={{
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '1.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <ImageIcon size={16} style={{ color: 'var(--color-text-muted)' }} />
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--color-text-secondary)'
                            }}>
                                Image Details
                            </span>
                        </div>

                        {/* File Info */}
                        <div className="info-row" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                File Type
                            </span>
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--color-text-primary)',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(102, 126, 234, 0.15)',
                                borderRadius: '20px',
                                border: '1px solid rgba(102, 126, 234, 0.3)'
                            }}>
                                {getFileType()}
                            </span>
                        </div>

                        <div className="info-row" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                File Size
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>

                        {originalDimensions && (
                            <div className="info-row" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.75rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    Original Resolution
                                </span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                    {originalDimensions.width} × {originalDimensions.height}
                                </span>
                            </div>
                        )}

                        {resultData && (
                            <>
                                <div className="info-row" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                        Enhanced Resolution
                                    </span>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {resultData.width ? `${resultData.width} × ${resultData.height}` : 'Calculating...'}
                                    </span>
                                </div>
                                {originalDimensions && resultData.width && (
                                    <div className="info-row" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0'
                                    }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                            Quality Increase
                                        </span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '700',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            ↑ {calculateIncrease()}% pixels
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {!processedUrl ? (
                    <motion.button
                        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                        onClick={onUpscale}
                        disabled={isProcessing}
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: isProcessing
                                ? 'rgba(102, 126, 234, 0.5)'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s ease',
                            boxShadow: isProcessing ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Processing Magic...</span>
                            </>
                        ) : (
                            <>
                                <Zap size={20} fill="currentColor" />
                                <span>Enhance Image</span>
                            </>
                        )}
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDownload}
                        style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                        }}
                    >
                        <Download size={20} />
                        <span>💾 Download Enhanced</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default SettingsPanel;
