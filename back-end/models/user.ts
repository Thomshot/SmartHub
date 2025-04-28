import mongoose, { Schema, Document, Types } from 'mongoose';
import { IDevice } from './device'; // si besoin

// 🔥 Petit device stocké chez l'utilisateur
export interface IUserDeviceEmbedded {
  idUnique: string;
  nom: string;
  type: string;
  statutActuel: string;
  // Ajoute d'autres champs si tu veux (température, connectivité, etc)
}

// 🔥 Objet device pour User
export interface IUserDevice {
  device: IUserDeviceEmbedded; // Ici on n'a pas ObjectId ni IDevice complet
  statutActuel: string;
}

// 🔥 L'utilisateur complet
export interface IUser extends Document {
  gender?: string;
  otherGender?: string;
  birthDate: string;
  lastName: string;
  firstName: string;
  city: string;
  address: string;
  email: string;
  password: string;
  login?: string;
  memberType?: string;
  photo?: string;
  role: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  isVerified: boolean;
  verificationToken?: string;
  userType: 'simple' | 'complexe' | 'administrateur';
  points: number;
  userDevices: IUserDevice[];
}

// Schéma pour sous-objet Device dans userDevices
const userDeviceSchema = new Schema({
  device: {
    idUnique: { type: String, required: true },
    nom: { type: String, required: true },
    type: { type: String, required: true },
    statutActuel: { type: String, required: true },
  },
  statutActuel: { type: String, required: true },
});

// Schéma principal User
const userSchema = new Schema({
  gender: { type: String },
  otherGender: { type: String },
  birthDate: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  login: { type: String },
  memberType: { type: String },
  photo: { type: String, default: '' },
  role: { type: String, default: 'débutant', enum: ['débutant', 'intermédiaire', 'avancé', 'expert'] },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  userType: { type: String, default: 'simple', enum: ['simple', 'complexe', 'administrateur'] },
  points: { type: Number, default: 0 },
  userDevices: [userDeviceSchema],
}, { timestamps: true });

// Export du modèle User
export default mongoose.model<IUser>('User', userSchema, 'users');
