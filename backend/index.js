const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const leaveRoutes = require('./src/routes/leaveRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Logging middleware (optional but helpful)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          .endpoint {
            background: #f8f9fa;
            padding: 10px;
            margin: 10px 0;
            border-left: 4px solid #007bff;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Employee Leave System Backend 🚀</h1>
          <p>Server is running successfully!</p>
          
          <h3>Available Endpoints:</h3>
          <div class="endpoint">GET  <a href="/health">/health</a> - Basic health check</div>
          <div class="endpoint">GET  <a href="/api/health">/api/health</a> - API health check</div>
          <div class="endpoint">GET  <a href="/api/test">/api/test</a> - Test endpoint</div>
          <div class="endpoint">POST /auth/login - User login</div>
          <div class="endpoint">POST /auth/register - User registration</div>
          <div class="endpoint">GET  /leaves - Get all leaves</div>
          <div class="endpoint">POST /leaves - Create new leave</div>
        </div>
      </body>
    </html>
  `);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    message: 'Server is healthy'
  });
});

// API health check (what your frontend is trying to access)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    server: 'Employee Leave System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      auth: '/auth',
      leaves: '/leaves'
    }
  });
});

// API test endpoint (what your frontend is trying to access)
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API test endpoint is working!',
    server: 'Employee Leave System Backend',
    timestamp: new Date().toISOString(),
    status: 'All systems operational'
  });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/leaves', leaveRoutes);

// Also mount them under /api if needed for consistency
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET  /',
      'GET  /health',
      'GET  /api/health',
      'GET  /api/test',
      'POST /auth/login',
      'POST /auth/register',
      'GET  /leaves',
      'POST /leaves',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/leaves',
      'POST /api/leaves'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 API Test: http://localhost:${PORT}/api/test`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/auth/login`);
  console.log(`👤 Register: POST http://localhost:${PORT}/auth/register`);
  console.log(`📋 Leaves: GET http://localhost:${PORT}/leaves`);
  console.log('\n📱 Frontend should connect to:');
  console.log(`   - http://localhost:${PORT}/api/health`);
  console.log(`   - http://localhost:${PORT}/api/test`);
});