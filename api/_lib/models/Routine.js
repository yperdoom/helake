import mongoose from 'mongoose';

const RoutineExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  targetSets: { type: Number, min: 0 },
  targetReps: { type: Number, min: 0 },
  targetLoad: { type: Number, min: 0 },
  order: { type: Number, default: 0 },
}, { _id: false });

const RoutineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  exercises: [RoutineExerciseSchema],
}, { timestamps: true });

export default mongoose.models.Routine || mongoose.model('Routine', RoutineSchema);
