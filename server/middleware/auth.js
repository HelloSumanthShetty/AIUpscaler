import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional auth - continues even if no auth
export const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch (error) {
        // Silent fail for optional auth
        req.user = null;
    }
    next();
};
