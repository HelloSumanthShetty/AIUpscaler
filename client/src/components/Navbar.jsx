import React, { useState } from 'react';
import { Zap, Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="glass-panel nav-glass">
                    <Link
                        to="/"
                        className="nav-logo"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="logo-icon">
                            <Zap size={18} fill="currentColor" />
                        </div>
                        <span className="nav-brand">
                            Img<span style={{ color: 'var(--color-primary)' }}>Upscaler</span>
                        </span>
                    </Link>

                    <div className="nav-links">
                        <a href="#history" className="nav-link">History</a>
                        <a href="#home-showcase" className="nav-link">Showcase</a>
                        <a href="#about" className="nav-link">About</a>
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <div className="user-menu-container">
                                <button
                                    className="user-menu-trigger"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    {user.photo ? (
                                        <img src={user.photo} alt={user.name} className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <span className="user-name">{user.name}</span>
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            className="user-dropdown"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="user-dropdown-header">
                                                <p className="user-dropdown-name">{user.name}</p>
                                                <p className="user-dropdown-email">{user.email}</p>
                                            </div>
                                            <div className="user-dropdown-divider"></div>
                                            <button className="user-dropdown-item" onClick={handleLogout}>
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary btn-nav-action">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
