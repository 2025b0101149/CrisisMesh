import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { isOriginAllowed } from './config/cors.js';

const server = http.createServer(app);

// Initialize Socket.IO with production CORS policy
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Socket.IO CORS blocked for origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`⚡ [Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`⚡ [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

export const emitIncidentCreated = (incident) => {
  if (io) {
    io.emit('incident:created', incident);
  }
};

export const emitIncidentUpdated = (incident) => {
  if (io) {
    io.emit('incident:updated', incident);
  }
};

const startServer = async () => {
  // Attempt database connection
  await connectDB();

  server.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on port ${config.port}`);
    console.log('====================================================');
    console.log(`🚨 CrisisMesh Backend Service Started`);
    console.log(`📡 URL: http://0.0.0.0:${config.port}`);
    console.log(`🩺 Health check: /api/health`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Allowed Client: ${config.clientUrl}`);
    console.log('====================================================');
  });
};

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down CrisisMesh backend...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

startServer();

