import './config/env.js';
import { upscaleImage } from './models/upscaleModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n=== TESTING UPSCALE FUNCTION ===\n');

// Create a tiny test image (1x1 red pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');

console.log('✓ Testing with a 1x1 red pixel PNG');
console.log('  Buffer size:', testImageBuffer.length, 'bytes');
console.log('  Scale factor: 2x\n');

upscaleImage(testImageBuffer, 'image/png', 2)
    .then(result => {
        console.log('✓ SUCCESS! Upscale completed');
        console.log('  URL:', result.url);
        console.log('  Width:', result.width);
        console.log('  Height:', result.height);
        console.log('\n✓✓✓ Server is working correctly!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('✗ FAILED! Upscale error');
        console.error('  Message:', error.message);
        console.error('  Details:', error);
        console.log('\n✗✗✗ Please check the error above.\n');
        process.exit(1);
    });
