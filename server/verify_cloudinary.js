import './config/env.js';
import { v2 as cloudinary } from 'cloudinary';

console.log('\n=== CLOUDINARY CREDENTIAL TEST ===\n');

// Check if env vars are loaded
console.log('✓ Checking environment variables:');
console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Present' : '✗ MISSING');
console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Present' : '✗ MISSING');
console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Present' : '✗ MISSING');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('\n✓ Testing Cloudinary connection...');

// Test API by fetching resources (this will verify the credentials work)
cloudinary.api.ping()
    .then(result => {
        console.log('✓ SUCCESS! Cloudinary connection established');
        console.log('  Response:', result);
        console.log('\n✓✓✓ All tests passed! Server should work correctly.\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('✗ FAILED! Could not connect to Cloudinary');
        console.error('  Error:', error.message);
        console.log('\n✗✗✗ Please check your Cloudinary credentials.\n');
        process.exit(1);
    });
