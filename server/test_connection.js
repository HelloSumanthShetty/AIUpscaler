
async function testServer() {
    try {
        console.log("Testing connection to server...");

        // Test Upscale Endpoint (POST)
        const responseUpscale = await fetch('https://aiupscaler.onrender.com/api/upscale', {
            method: 'POST'
        });
        console.log(`POST /api/upscale status: ${responseUpscale.status}`);

        // Test Download Endpoint (GET)
        const responseDownload = await fetch('https://aiupscaler.onrender.com/api/download');
        console.log(`GET /api/download status: ${responseDownload.status}`);

    } catch (error) {
        console.error("Failed to connect to server:", error.message);
    }
}

testServer();
