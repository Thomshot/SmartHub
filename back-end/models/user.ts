import mongoose from 'mongoose';

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
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users');
