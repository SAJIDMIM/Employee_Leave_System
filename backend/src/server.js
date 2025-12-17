require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const adminRoutes = require('./routes/admin');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes - All routes under /api
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));\
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Leave Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    endpoints: {
      login: 'POST /api/auth/login',
      health: 'GET /api/health'
    }
  });
});

// Redirect root to API info
app.get('/', (req, res) => {
  res.json({
    name: 'Leave Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      leaves: '/api/leaves',
      health: '/api/health'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/test`);
});