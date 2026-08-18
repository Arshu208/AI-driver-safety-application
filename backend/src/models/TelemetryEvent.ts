import mongoose from 'mongoose';

const TelemetryEventSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  fatigueLevel: { type: Number, required: true },
  blinkRate: { type: Number, required: true },
  perclos: { type: Number, required: true },
  isDrowsy: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
}, { versionKey: false });

export default mongoose.model('TelemetryEvent', TelemetryEventSchema);
