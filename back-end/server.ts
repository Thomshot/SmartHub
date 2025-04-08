import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/user';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI!;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));


app.post('/api/register', async (req, res) => {
  const user = req.body;
  try {
    const newUser = await User.create(user);
    res.status(201).json({ message: 'Utilisateur enregistré', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
  }
});


app.listen(port, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${port}`);
});
