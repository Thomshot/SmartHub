import mongoose, { Types, Document } from 'mongoose';
import { IDevice } from './device';

export interface IUserDevice {
  device: Types.ObjectId | IDevice; // soit ObjectId soit Device
  statutActuel: string;
}

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

const userDeviceSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  statutActuel: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
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

export default mongoose.model<IUser>('User', userSchema, 'users');
