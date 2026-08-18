import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { setupTelemetrySocket } from './websocket/telemetry';
import { setSocketIo } from './websocket';
import authRoutes from './routes/auth';
import tripRoutes from './routes/trips';
import analyticsRoutes from './routes/analytics';
import navigationRoutes from './routes/navigation';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridesafe';

// REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/navigation', navigationRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Setup Websockets
setupTelemetrySocket(io);
setSocketIo(io);

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RideSafe Backend is running' });
});

const PORT = Number(process.env.PORT) || 5000;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, '0.0.0.0', () => console.log(`Server listening on 0.0.0.0:${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
