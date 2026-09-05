import mongoose from 'mongoose';
import { centsField } from '../money.js';

const SINGLETON_ID = 'global';

const SettingsSchema = new mongoose.Schema({
  _id: { type: String, default: SINGLETON_ID },
  businessName: { type: String, default: 'Sweet Tooth' },
  ownerName: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  currency: { type: String, default: 'BRL' },
  gasCents: centsField({ default: 0 }),
  electricityCents: centsField({ default: 0 }),
  waterCents: centsField({ default: 0 }),
  otherCents: centsField({ default: 0 }),
  monthlyHours: { type: Number, default: 160 },
  defaultInfraPercentage: { type: Number, default: 15 },
  defaultMargin: { type: Number, default: 50 },
}, { timestamps: true });

SettingsSchema.statics.getOrCreate = async function () {
  return this.findByIdAndUpdate(
    SINGLETON_ID,
    { $setOnInsert: {} },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
