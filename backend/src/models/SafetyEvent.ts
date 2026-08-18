import mongoose from 'mongoose';

const SafetyEventSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  severity: { type: String, required: true },
  eventType: { type: String, required: true },
  fatigue: { type: Number, required: true },
  perclos: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
}, { versionKey: false });

export default mongoose.model('SafetyEvent', SafetyEventSchema);
