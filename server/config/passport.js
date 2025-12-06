import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';

// Serialize user for the session (we won't use sessions, but required by passport)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                photo: profile.photos[0]?.value,
                provider: 'google'
            };
            return done(null, user);
        }));
}

// Generate JWT token for user
export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            photo: user.photo,
            provider: user.provider
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export default passport;
