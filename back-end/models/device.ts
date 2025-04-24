import mongoose, { Schema, Document } from 'mongoose';

// Interface pour typer les objets Device
export interface IDevice extends Document {
  idUnique: string;
  nom: string;
  type: string;
  statutActuel: string;
  états: string[];
  fonctionnalités: string[];
  dernièreMiseÀJour: Date;
  températureActuelle?: number;
  températureCible?: number;
  mode?: string;
  connectivité?: string;
  étatDeBatterie?: string;
  résolution?: string;
  couleurActuelle?: string;
  luminosité?: string;
  consommationActuelle?: string;
  niveauDeBatterie?: string;
  humidité?: string;
  volumeActuel?: string;
  dernièreInteraction?: Date;
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
  dernièreInteraction: { type: Date, default: Date.now },
  brand: { type: String },
  room: { type: String },
  ip: { type: String },
  mac: { type: String },
  protocol: { type: String },
  image: { type: String }, // URL ou base64 de l'image
});

// Export du modèle
export default mongoose.model<IDevice>('Device', deviceSchema);