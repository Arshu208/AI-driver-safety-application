import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { setupTelemetrySocket } from './websocket/telemetry';
import tripRoutes from './routes/trips';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// REST Routes
app.use('/api/trips', tripRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to the frontend URL
    methods: ['GET', 'POST']
  }
});

// Setup Websockets
setupTelemetrySocket(io);

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RideSafe Backend is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
