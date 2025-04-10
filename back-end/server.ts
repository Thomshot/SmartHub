import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/user';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true,
}));
app.use(express.json());

// ✅ Routes ensuite
app.use('/api', authRoutes);

// ✅ Connexion MongoDB
const mongoURI = process.env.MONGO_URI!;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// (optionnel) si tu gardes une route /api/register ici
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
