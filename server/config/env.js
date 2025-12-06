import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory (one level up from config/)
const serverEnvPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: serverEnvPath });

console.log('Environment variables loaded.');
console.log('Cloud Name present:', !!process.env.CLOUDINARY_CLOUD_NAME);
