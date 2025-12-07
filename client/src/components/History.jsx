import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Download, Trash2 } from 'lucide-react';
import { useImageHistory } from '../hooks/useImageHistory';
import { useAuth } from '../contexts/AuthContext';

const History = () => {
    const { user } = useAuth();
    const { history, storageInfo, removeFromHistory, clearHistory } = useImageHistory(user?.id);

    if (history.length === 0) {
        return (
            <section id="history" className="section">
                <div className="container">
                    <h2 className="section-title">Your History</h2>
                    <div className="empty-state">
                        <Clock size={48} style={{ opacity: 0.3 }} />
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                            No enhanced images yet. Upload an image to get started!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <section id="history" className="section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 className="section-title">Your History</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            {history.length} images • {storageInfo.sizeInMB} MB
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (confirm('Clear all history? This cannot be undone.')) {
                                clearHistory();
                            }
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            color: '#ef4444',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.25) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.1)';
                        }}
                    >
                        <Trash2 size={16} />
                        Clear All
                    </motion.button>
                </div>

                <div className="history-grid">
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            className="history-item glass-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <div
                                className="history-images"
                                onClick={() => window.open(item.enhancedUrl, '_blank')}
                                style={{ cursor: 'pointer' }}
                                title="Click to view full image"
                            >
                                <img src={item.enhancedUrl} alt="Enhanced" className="history-image" />
                                <div className="history-badge">{item.scale}x</div>
                            </div>

                            <div className="history-info">
                                <p className="history-date">{formatDate(item.timestamp)}</p>
                                <p className="history-dimensions">
                                    {item.resultWidth} × {item.resultHeight}
                                </p>
                            </div>

                            <div className="history-actions">
                                <a
                                    href={item.enhancedUrl}
                                    download={`enhanced-${item.id}.png`}
                                    className="history-action-btn"
                                    title="Download"
                                >
                                    <Download size={16} />
                                </a>
                                <button
                                    onClick={() => removeFromHistory(item.id)}
                                    className="history-action-btn"
                                    title="Remove"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default History;
