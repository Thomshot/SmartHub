import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  statutActuel: { type: String, required: true },
  états: { type: [String], required: true },
  fonctionnalités: { type: [String], required: true },
  dernièreMiseÀJour: { type: Date, default: Date.now },
});

export default mongoose.model('Device', deviceSchema);
