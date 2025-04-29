import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device.routes';
import serviceRoutes from './routes/service.routes';
import userRoutes from './routes/user.routes';
import path from 'path';
import actionsRouter from './routes/actions.routes';

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
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/actions', actionsRouter);

// ✅ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

mongoose.connection.on('connected', () => {
  console.log('📡 Connexion MongoDB établie.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB :', err);
});

mongoose.set('debug', true); // Active les logs des requêtes MongoDB

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur Express lancé sur http://localhost:${port}`);
});