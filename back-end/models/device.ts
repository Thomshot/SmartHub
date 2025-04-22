import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  idUnique: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  type: { type: String, required: true },
  statutActuel: { type: String, required: true },
  états: { type: [String], required: true },
  fonctionnalités: { type: [String], required: true },
  dernièreMiseÀJour: { type: Date, default: Date.now },
  températureActuelle: { type: Number },
  températureCible: { type: Number },
  mode: { type: String },
  connectivité: { type: String },
  étatDeBatterie: { type: String },
  résolution: { type: String },
  couleurActuelle: { type: String },
  luminosité: { type: String },
  consommationActuelle: { type: String },
  niveauDeBatterie: { type: String },
  humidité: { type: String },
  volumeActuel: { type: String },
  dernièreInteraction: { type: Date, default: Date.now }
});

console.log('✅ Modèle Device chargé avec succès.');

export default mongoose.model('Device', deviceSchema);
