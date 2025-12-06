import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAuth } from '../contexts/AuthContext';

const HeroHeader = () => {
    const { displayText: typedText, isComplete } = useTypewriter('Upscale & Enhance Images', 50, 400);
    const { usage } = useAuth();

    return (
        <>
            {usage && (
                <motion.div
                    className="usage-badge"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: usage.remaining > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: usage.remaining > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '100px',
                        color: usage.remaining > 0 ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        marginBottom: '1.5rem'
                    }}
                >
                    <span>{usage.count}/{usage.limit} uploads today</span>
                    {usage.remaining === 0 && <span>• Limit reached</span>}
                </motion.div>
            )}

            <motion.div
                className="hero-badge"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <Zap size={14} />
                <span>#1 AI Image Upscaler</span>
            </motion.div>

            <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <span>{typedText}{!isComplete && <span className="typing-cursor">|</span>}</span>
                <br />
                <span className="text-gradient">Up to 4K Resolution</span>
            </motion.h1>

            <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Increase image resolution by 200% or 400% with our advanced AI.
                Restore details, sharpen blurry photos, and enhance quality instantly.
            </motion.p>
        </>
    );
};

export default HeroHeader;
