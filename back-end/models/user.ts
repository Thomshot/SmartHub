import mongoose, { Schema, Document } from 'mongoose';

// Interface pour le sous-objet Device intégré dans un utilisateur
export interface IUserDeviceEmbedded {
  idUnique: string;
  nom: string;
  type: string;
  statutActuel: string;
  etats?: string[];
  fonctionnalites?: string[];
  derniereMiseAJour?: Date;
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

// Objet device pour User
export interface IUserDevice {
  device: IUserDeviceEmbedded;
  statutActuel: string;
}

// Interface complète pour un utilisateur
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
  role: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  isVerified: boolean;
  verificationToken?: string;
  userType: 'simple' | 'complexe' | 'administrateur';
  points: number;
  userDevices: IUserDevice[];
}

// Schéma pour un device dans un utilisateur
const userDeviceSchema = new Schema({
  device: {
    idUnique: { type: String, required: true },
    nom: { type: String, required: true },
    type: { type: String, required: true },
    statutActuel: { type: String, required: true },
    etats: { type: [String] },
    fonctionnalites: { type: [String] },
    derniereMiseAJour: { type: Date },
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
    derniereInteraction: { type: Date },
    brand: { type: String },
    room: { type: String },
    ip: { type: String },
    mac: { type: String },
    protocol: { type: String },
    image: { type: String },
  },
  statutActuel: { type: String, required: true },
});

// Schéma principal pour l'utilisateur
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
  role: {
    type: String,
    default: 'débutant',
    enum: ['débutant', 'intermédiaire', 'avancé', 'expert'],
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  userType: {
    type: String,
    default: 'simple',
    enum: ['simple', 'complexe', 'administrateur'],
  },
  points: { type: Number, default: 0 },
  userDevices: [userDeviceSchema],
}, { timestamps: true });

// Export du modèle
export default mongoose.model<IUser>('User', userSchema, 'users');
