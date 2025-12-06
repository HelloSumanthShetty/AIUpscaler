import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEnhanced, setIsEnhanced] = useState(false);

    const showcaseImages = [
        {
            image: '/assets/showcase/chinese-professional.png',
            title: 'Professional Headshots',
            description: 'Transform portraits into crisp LinkedIn-ready images'
        },
        {
            image: '/assets/showcase/casual-woman.png',
            title: 'Casual Photography',
            description: 'Enhance everyday photos with stunning clarity'
        },
        {
            image: '/assets/showcase/black-couple-fashion.png',
            title: 'Fashion & Lifestyle',
            description: 'Perfect for social media and marketing content'
        },
        {
            image: '/assets/showcase/sunset-sundress.png',
            title: 'Artistic Captures',
            description: 'Preserve precious moments in crystal-clear quality'
        },
        {
            image: '/assets/showcase/egirl-aesthetic.png',
            title: 'Creative Content',
            description: 'Stand out on Instagram and TikTok'
        }
    ];

    // Auto-rotate carousel
    useEffect(() => {
        const enhanceTimer = setTimeout(() => {
            setIsEnhanced(true);
        }, 1500);

        const slideTimer = setTimeout(() => {
            setIsEnhanced(false);
            setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
        }, 5000);

        return () => {
            clearTimeout(enhanceTimer);
            clearTimeout(slideTimer);
        };
    }, [currentIndex, showcaseImages.length]);

    return (
        <section id="home-showcase" className="section" style={{ background: 'var(--color-bg-primary)', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginBottom: '1rem'
                    }}>
                        <Sparkles size={28} className="text-gradient" />
                        <h2 className="section-title" style={{ margin: 0 }}>
                            See the <span className="text-gradient">Transformation</span>
                        </h2>
                    </div>
                    <p className="section-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        Watch how our AI enhances real photos. From blurry to brilliant in seconds.
                    </p>
                </motion.div>

                {/* Before/After Showcase */}
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Status Label */}
                        <div style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            zIndex: 10,
                            background: isEnhanced
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)'
                                : 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '100px',
                            border: isEnhanced
                                ? '1px solid rgba(16, 185, 129, 0.4)'
                                : '1px solid rgba(255,255,255,0.2)',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            transition: 'all 0.5s ease'
                        }}>
                            <AnimatePresence mode="wait">
                                {isEnhanced ? (
                                    <motion.span
                                        key="enhanced"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="text-gradient"
                                    >
                                        ✨ AI Enhanced
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="original"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        Original Photo
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Image Container */}
                        <div style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            aspectRatio: '4/3',
                            background: '#000'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <motion.img
                                        src={showcaseImages[currentIndex].image}
                                        alt={showcaseImages[currentIndex].title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        animate={{
                                            filter: isEnhanced
                                                ? 'brightness(1.15) contrast(1.2) saturate(1.15) blur(0px)'
                                                : 'brightness(0.8) contrast(0.85) saturate(0.7) blur(1px)',
                                            scale: isEnhanced ? 1.03 : 1
                                        }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />

                                    {/* Enhancement Glow Effect */}
                                    {isEnhanced && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 0.3, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Image Info */}
                        <motion.div
                            key={`info-${currentIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                marginTop: '1.5rem',
                                textAlign: 'center'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '0.5rem',
                                color: 'var(--color-text-primary)'
                            }}>
                                {showcaseImages[currentIndex].title}
                            </h3>
                            <p style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}>
                                {showcaseImages[currentIndex].description}
                            </p>
                        </motion.div>

                        {/* Carousel Dots */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '1.5rem'
                        }}>
                            {showcaseImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsEnhanced(false);
                                        setCurrentIndex(idx);
                                    }}
                                    style={{
                                        width: idx === currentIndex ? '32px' : '8px',
                                        height: '8px',
                                        borderRadius: '100px',
                                        background: idx === currentIndex
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        padding: 0
                                    }}
                                    aria-label={`View image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroShowcase;
