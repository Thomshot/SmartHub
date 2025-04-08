import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  gender: String,
  otherGender: String,
  birthDate: String,
  lastName: String,
  firstName: String,
  city: String,
  street: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
