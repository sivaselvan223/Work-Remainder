const jwt = require('jsonwebtoken');

let io = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
  if (!allowedOrigins.includes('https://work-remainder.vercel.app')) {
    allowedOrigins.push('https://work-remainder.vercel.app');
  }

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST']
    }
  });

  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);
    
    // Join user's personal room
    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.userId}`);
    });
  });

  console.log('🔌 Socket.io initialized');
  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
