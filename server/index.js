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

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3002',
    'https://aiupscaler-1.onrender.com',
    'https://aiupscaler.onrender.com',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
