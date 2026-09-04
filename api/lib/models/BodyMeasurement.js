import mongoose from 'mongoose';

const BodyMeasurementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, default: Date.now },
  weight: { type: Number, min: 0 },
  measurements: { type: Map, of: Number, default: {} },
}, { timestamps: true });

export default mongoose.models.BodyMeasurement
  || mongoose.model('BodyMeasurement', BodyMeasurementSchema);
