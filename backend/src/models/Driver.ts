import mongoose from 'mongoose';

const PasskeySchema = new mongoose.Schema({
  credentialID: { type: String, required: true },
  publicKey: { type: String, required: true },
  counter: { type: Number, required: true, default: 0 },
}, { _id: false });

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String },
  vehicleNumber: { type: String },
  emergencyContact: { type: String },
  safetyScore: { type: Number, default: 100 },
  faceLockEnabled: { type: Boolean, default: false },
  passkeys: { type: [PasskeySchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Driver', DriverSchema);
