import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Code2, Heart } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        {
            name: 'GitHub',
            icon: Github,
            url: 'https://github.com/HelloSumanthShetty',
            color: '#333'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: 'https://www.linkedin.com/in/sumanth-shetty-dev/',
            color: '#0077b5'
        },
        {
            name: 'Twitter/X',
            icon: Twitter,
            url: 'https://x.com/sumShetty_dev',
            color: '#1DA1F2'
        },
        {
            name: 'LeetCode',
            icon: Code2,
            url: 'https://leetcode.com/u/SumanthShetty7/',
            color: '#FFA116'
        }
    ];

    return (
        <footer style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '3rem 0 2rem',
            marginTop: '4rem'
        }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}
                >
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Connect With Me
                        </h3>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            lineHeight: '1.7',
                            fontSize: '0.95rem',
                            marginBottom: '2rem'
                        }}>
                            Built with passion by a developer who loves creating beautiful web experiences.
                            Let's connect and build something amazing together!
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {socialLinks.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    whileHover={{
                                        scale: 1.1,
                                        y: -5
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '14px',
                                        color: 'var(--color-text-secondary)',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = `${social.color}15`;
                                        e.currentTarget.style.borderColor = `${social.color}40`;
                                        e.currentTarget.style.color = social.color;
                                        e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}30`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    title={social.name}
                                >
                                    <Icon size={24} />
                                </motion.a>
                            );
                        })}
                    </div>

                    <div style={{
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <span>&copy; {new Date().getFullYear()} ImgUpscaler.</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for You
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
