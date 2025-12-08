import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import offerRoutes from './routes/offers.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

// ----------------------
// ES Modules fix
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// ENV CONFIG
// ----------------------
dotenv.config();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "https://serene-embrace-production.up.railway.app";
const PORT = process.env.PORT || 5000;

// ----------------------
// ALLOWED ORIGINS
// ----------------------
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://serene-embrace-production.up.railway.app',
  'https://yaar-fetchv2-eight.vercel.app'
];

// ----------------------
// CORS CONFIGURATION
// ----------------------
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman / server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ----------------------
// SOCKET.IO CORS
// ----------------------
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  }
});

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------------
// UPLOADS FOLDER
// ----------------------
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ----------------------
// ROUTES
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// ----------------------
// HEALTH CHECK
// ----------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins,
      frontendUrl: FRONTEND_URL
    }
  });
});

// ----------------------
// CORS TEST ENDPOINT
// ----------------------
app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    allowed: allowedOrigins.includes(req.headers.origin || '')
  });
});

// ----------------------
// SOCKET.IO EVENTS
// ----------------------
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`Socket ${socket.id} joined room match-${matchId}`);
  });

  socket.on('leave-room', (matchId) => {
    socket.leave(`match-${matchId}`);
    console.log(`Socket ${socket.id} left room match-${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// ----------------------
// ERROR HANDLING
// ----------------------
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      yourOrigin: req.headers.origin,
      allowedOrigins
    });
  }
  next(err);
});

// ----------------------
// START SERVER
// ----------------------
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed Origins: ${JSON.stringify(allowedOrigins)}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS Test: http://localhost:${PORT}/api/cors-test`);
});

export { io };
