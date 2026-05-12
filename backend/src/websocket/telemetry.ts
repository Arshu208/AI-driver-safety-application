import { Server, Socket } from 'socket.io';
import { RiskEngine } from '../services/riskEngine';
import { EventRecorder } from '../services/eventRecorder';

// Memory cache to throttle telemetry writes (every 10 seconds per trip)
const lastWriteCache: Record<string, number> = {};

export const setupTelemetrySocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Listen for driver telemetry streams
    socket.on('driverTelemetry', async (data) => {
      // Hardcoded tripId for demonstration until full DB relation is built
      const tripId = data.tripId || 'demo-trip-id';
      const now = Date.now();

      // 1. Process Risk
      const riskResult = await RiskEngine.processTelemetry(tripId, data);

      // 2. Telemetry Persistence (Throttled to every 10 seconds)
      const lastWrite = lastWriteCache[tripId] || 0;
      if (now - lastWrite > 10000) {
        await EventRecorder.recordTelemetry(
          tripId, 
          data.fatigueLevel, 
          data.blinkRate, 
          parseFloat(data.perclos), 
          data.isDrowsy
        );
        lastWriteCache[tripId] = now;
      }

      // 3. Fleet Broadcast
      if (riskResult.triggerAlert) {
        io.emit('fleetAlert', {
          driverId: data.driverId || socket.id,
          tripId,
          message: `ALERT: ${riskResult.eventType}`,
          severity: riskResult.severity,
          fatigueLevel: data.fatigueLevel,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
