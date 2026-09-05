import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
