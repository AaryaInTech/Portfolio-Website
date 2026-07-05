const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the frontend directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Cache portfolio data at startup to avoid blocking I/O on requests
const dataPath = path.join(__dirname, '../data.json');
let portfolioData = null;

function loadPortfolioData() {
    try {
        portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log('✅ Portfolio data loaded and cached successfully');
    } catch (error) {
        console.error('❌ Error caching portfolio data on startup:', error);
    }
}
loadPortfolioData();

// API Route: Get portfolio data
app.get('/api/portfolio', (req, res) => {
    if (portfolioData) {
        res.json(portfolioData);
    } else {
        // Fallback if loading failed on startup
        try {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            portfolioData = data; // Cache it now
            res.json(data);
        } catch (error) {
            console.error('Error reading portfolio data:', error);
            res.status(500).json({ error: 'Failed to load portfolio data' });
        }
    }
});

// API Route: Handle contact form submissions
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // In a production environment, you would:
        // 1. Send an email using a service like Nodemailer, SendGrid, etc.
        // 2. Store the message in a database
        // 3. Send a notification
        
        // For now, we'll just log it and return success
        console.log('Contact form submission:', { name, email, message });
        
        // TODO: Implement email sending service
        // Example: await sendEmail({ to: 'aarya.gourkar05@gmail.com', subject: `Contact from ${name}`, text: message });
        
        res.json({ 
            success: true, 
            message: 'Message received successfully. I\'ll get back to you soon!' 
        });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Failed to process contact form' });
    }
});

// API Route: Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
});

// Fallback: Serve index.html for client-side routing (SPA)
// This must be last to catch all non-API routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/portfolio`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
});

