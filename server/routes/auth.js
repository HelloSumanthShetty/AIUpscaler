import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateToken } from '../config/passport.js';
import { getUserUsage } from '../utils/usageTracker.js';

const router = express.Router();

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        const token = generateToken(req.user);

        // Set JWT in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to client
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }
);

// Get current user
router.get('/user', (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        const usage = getUserUsage(user.email);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                photo: user.photo,
                provider: user.provider
            },
            usage: {
                count: usage.count,
                limit: 10,
                remaining: Math.max(0, 10 - usage.count)
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

export default router;
