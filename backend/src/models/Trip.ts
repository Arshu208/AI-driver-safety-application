import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  safetyScore: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);
