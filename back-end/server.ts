import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true,
}));

app.use(express.json());

// ✅ Sert les images du dossier uploads statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes principales
app.use('/api', authRoutes);

// ✅ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${port}`);
});
