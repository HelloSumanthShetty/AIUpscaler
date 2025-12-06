import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Clock } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Sparkles size={24} />,
            title: 'AI-Powered Enhancement',
            description: 'Our advanced AI technology enhances image quality while preserving natural details and textures.'
        },
        {
            icon: <Zap size={24} />,
            title: 'Lightning Fast',
            description: 'Process your images in seconds with our optimized Cloudinary infrastructure.'
        },
        {
            icon: <Shield size={24} />,
            title: 'Secure & Private',
            description: 'Your images are processed securely and never stored on our servers permanently.'
        },
        {
            icon: <Clock size={24} />,
            title: 'Always Free',
            description: 'No hidden fees, no subscriptions. Upscale unlimited images completely free.'
        }
    ];

    return (
        <section id="about" className="about-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="about-header"
                >
                    <h2 className="section-title">
                        Why Choose <span className="text-gradient">AI Image Scale</span>?
                    </h2>
                    <p className="section-subtitle">
                        Transform your images with cutting-edge AI technology. No experience required.
                    </p>
                </motion.div>

                <div className="features-showcase">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="feature-card glass-panel"
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-description">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="how-it-works"
                >
                    <h3 className="subsection-title">How It Works</h3>
                    <div className="steps-grid">
                        {[
                            { step: '1', title: 'Upload', desc: 'Drop your image or click to browse' },
                            { step: '2', title: 'Choose Scale', desc: 'Select 2x or 4x upscaling' },
                            { step: '3', title: 'Enhance', desc: 'Let our AI work its magic' },
                            { step: '4', title: 'Download', desc: 'Get your enhanced image instantly' }
                        ].map((item, idx) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="step-item"
                            >
                                <div className="step-number">{item.step}</div>
                                <h4 className="step-title">{item.title}</h4>
                                <p className="step-desc">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
