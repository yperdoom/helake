import mongoose from 'mongoose';

const WorkoutEntrySchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  load: { type: Number, min: 0 },
}, { _id: false });

const WorkoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
  date: { type: Date, required: true, default: Date.now },
  entries: [WorkoutEntrySchema],
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.WorkoutLog || mongoose.model('WorkoutLog', WorkoutLogSchema);
