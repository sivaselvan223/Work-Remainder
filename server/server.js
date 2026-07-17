// Load environment variables FIRST, before anything else
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const { initEmailService } = require('./services/emailService');
const { startScheduler } = require('./services/scheduler');

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];
// Always allow the Vercel deployment
if (!allowedOrigins.includes('https://work-remainder.vercel.app')) {
  allowedOrigins.push('https://work-remainder.vercel.app');
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Initialize services and start server
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Socket.io
    const io = initSocket(server);
    app.set('io', io);

    // Initialize email service (optional)
    initEmailService();

    // Start cron scheduler
    startScheduler();

    // Start server
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io listening`);
      console.log(`⏰ Scheduler active\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

