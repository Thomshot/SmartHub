import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device.routes';
import serviceRoutes from './routes/service.routes';
import userRoutes from './routes/user.routes';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

// ✅ Middleware global pour déboguer les requêtes
app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    next();
});

// ✅ Configuration CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true,
}));

// ✅ Middleware pour parser les requêtes JSON
app.use(express.json());

// ✅ Sert les images du dossier uploads statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes principales
app.use('/api', authRoutes);
app.use('/api/devices', deviceRoutes);
console.log('✅ Route /api/devices enregistrée');
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// ✅ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${port}`);
});