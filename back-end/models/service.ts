import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  idUnique: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  type: { type: String, required: true },
  statutActuel: { type: String, required: true },
  etats: { type: [String], required: true },
  description: { type: String, required: true },
  tarif: { type: String, required: true },
  derniereMiseAJour: { type: Date, default: Date.now }
});

export default mongoose.model('Service', serviceSchema, 'services'); // ✅ Utilisez le nouveau nom de la collection
