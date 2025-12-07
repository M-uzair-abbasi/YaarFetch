import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import offerRoutes from './routes/offers';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import userRoutes from './routes/users';
import reviewRoutes from './routes/reviews';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "https://serene-embrace-production.up.railway.app";

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

// ----------------------
//   SOCKET.IO CORS
// ----------------------
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// ----------------------
//       CORS FIX
// ----------------------
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow no-origin (e.g., curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("/*", cors(corsOptions)); // allow preflight

// ----------------------
//    PARSING MIDDLEWARE
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
//   STATIC FILES
// ----------------------
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ----------------------
//        ROUTES
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// ----------------------
//     HEALTH CHECK
// ----------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ----------------------
//   SOCKET.IO EVENTS
// ----------------------
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (matchId: string) => {
    socket.join(`match-${matchId}`);
  });

  socket.on('leave-room', (matchId: string) => {
    socket.leave(`match-${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// ----------------------
//    START SERVER
// ----------------------
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed Frontend: ${FRONTEND_URL}`);
});

export { io };
