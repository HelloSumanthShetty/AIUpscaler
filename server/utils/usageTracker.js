import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USAGE_FILE = path.join(__dirname, '../data/usage.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dir = path.dirname(USAGE_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Read usage data
const readUsage = () => {
    ensureDataDir();
    if (!fs.existsSync(USAGE_FILE)) {
        return {};
    }
    try {
        const data = fs.readFileSync(USAGE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading usage file:', error);
        return {};
    }
};

// Write usage data
const writeUsage = (data) => {
    ensureDataDir();
    try {
        fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing usage file:', error);
    }
};

// Get user usage stats
export const getUserUsage = (email) => {
    const usage = readUsage();
    const today = new Date().toISOString().split('T')[0];

    const userUsage = usage[email] || {
        count: 0,
        lastReset: today,
        email: email
    };

    // Reset if it's a new day
    if (userUsage.lastReset !== today) {
        userUsage.count = 0;
        userUsage.lastReset = today;
    }

    return userUsage;
};

// Increment user usage
export const incrementUsage = (email, name = null) => {
    const usage = readUsage();
    const today = new Date().toISOString().split('T')[0];

    if (!usage[email]) {
        usage[email] = {
            email,
            name,
            count: 0,
            lastReset: today
        };
    }

    const userUsage = usage[email];

    // Reset if it's a new day
    if (userUsage.lastReset !== today) {
        userUsage.count = 0;
        userUsage.lastReset = today;
    }

    userUsage.count++;
    if (name) userUsage.name = name;

    writeUsage(usage);

    return userUsage;
};

// Check if user has exceeded limit
export const hasExceededLimit = (email, limit = 10) => {
    const userUsage = getUserUsage(email);
    return userUsage.count >= limit;
};
