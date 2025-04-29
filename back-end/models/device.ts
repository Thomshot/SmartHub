import mongoose, { Schema, Document } from 'mongoose';

// Interface pour typer les objets Device
export interface IDevice extends Document {
  idUnique: string;
  nom: string;
  type: string;
  statutActuel: string;
  etats: string[];
  fonctionnalites: string[];
  derniereMiseAJour: Date;
  temperatureActuelle?: number;
  temperatureCible?: number;
  mode?: string;
  connectivite?: string;
  etatBatterie?: string;
  resolution?: string;
  couleurActuelle?: string;
  luminosite?: string;
  consommationActuelle?: string;
  niveauBatterie?: string;
  humidite?: string;
  volumeActuel?: string;
  derniereInteraction?: Date;
  brand?: string;
  room?: string;
  ip?: string;
  mac?: string;
  protocol?: string;
  image?: string;
}

// Schéma Mongoose pour Device
const deviceSchema: Schema = new Schema({
  idUnique: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  type: { type: String, required: true },
  statutActuel: { type: String, required: true },
  etats: { type: [String], required: true },
  fonctionnalites: { type: [String], required: true },
  derniereMiseAJour: { type: Date, default: Date.now },
  temperatureActuelle: { type: Number },
  temperatureCible: { type: Number },
  mode: { type: String },
  connectivite: { type: String },
  etatBatterie: { type: String },
  resolution: { type: String },
  couleurActuelle: { type: String },
  luminosite: { type: String },
  consommationActuelle: { type: String },
  niveauBatterie: { type: String },
  humidite: { type: String },
  volumeActuel: { type: String },
  derniereInteraction: { type: Date, default: Date.now },
  brand: { type: String },
  room: { type: String },
  ip: { type: String },
  mac: { type: String },
  protocol: { type: String },
  image: { type: String },
});

// Export du modèle
export default mongoose.model<IDevice>('Device', deviceSchema);
