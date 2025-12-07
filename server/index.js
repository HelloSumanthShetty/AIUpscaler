import './config/env.js'; // MUST be first to load env vars before other imports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // Initialize passport strategies
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';

console.log('Server starting...');
console.log('Using Cloudinary for AI image upscaling');
console.log('Cloudinary configured:', !!process.env.CLOUDINARY_CLOUD_NAME);

const app = express();
const port = process.env.PORT || 3002;

// Configure CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session for passport (minimal, we use JWT)
app.use(session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AI Image Upscaler API',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/google',
            api: '/api/upscale'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
