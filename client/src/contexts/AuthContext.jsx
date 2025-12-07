import React, { createContext, useState, useContext, useEffect } from 'react';
import { CONFIG } from '../config';
const AuthContext = createContext();

const USAGE_STORAGE_KEY = 'daily_usage_count';
const USAGE_DATE_KEY = 'usage_date';
const DAILY_LIMIT = 2; // Default limit for non-logged-in users

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Get today's date string (YYYY-MM-DD)
const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

// Get usage from localStorage for non-logged-in users
const getLocalUsage = () => {
    try {
        const today = getTodayString();
        const savedDate = localStorage.getItem(USAGE_DATE_KEY);
        const savedCount = parseInt(localStorage.getItem(USAGE_STORAGE_KEY) || '0', 10);

        // Reset if it's a new day
        if (savedDate !== today) {
            localStorage.setItem(USAGE_DATE_KEY, today);
            localStorage.setItem(USAGE_STORAGE_KEY, '0');
            return { count: 0, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
        }

        return {
            count: savedCount,
            limit: DAILY_LIMIT,
            remaining: Math.max(0, DAILY_LIMIT - savedCount)
        };
    } catch (error) {
        console.error('Error reading local usage:', error);
        return { count: 0, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
    }
};

// Increment usage count in localStorage
const incrementLocalUsage = () => {
    try {
        const current = getLocalUsage();
        const newCount = current.count + 1;
        localStorage.setItem(USAGE_STORAGE_KEY, newCount.toString());
        return {
            count: newCount,
            limit: DAILY_LIMIT,
            remaining: Math.max(0, DAILY_LIMIT - newCount)
        };
    } catch (error) {
        console.error('Error incrementing local usage:', error);
        return getLocalUsage();
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user on mount & initialize usage
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const authUrl = CONFIG.API_URL.replace('/api', '/auth/user');
            const response = await fetch(authUrl, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setUsage(data.usage);
            } else {
                setUser(null);
                setUsage(getLocalUsage());
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            setUsage(getLocalUsage());
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const logoutUrl = CONFIG.API_URL.replace('/api', '/auth/logout');
            await fetch(logoutUrl, {
                credentials: 'include'
            });
            setUser(null);
            setUsage(getLocalUsage());
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshUsage = async () => {
        if (user) {
            // Logged-in user: fetch from server
            await fetchUser();
        } else {
            // Non-logged-in user: increment localStorage
            const newUsage = incrementLocalUsage();
            setUsage(newUsage);
        }
    };

    return (
        <AuthContext.Provider value={{ user, usage, loading, logout, refreshUsage }}>
            {children}
        </AuthContext.Provider>
    );
};
