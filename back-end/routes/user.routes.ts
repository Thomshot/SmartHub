import express from 'express';
import multer from 'multer';
import path from 'path';
import { searchUser, getProfile, updateUser } from '../controllers/user.controller';

const router = express.Router();

// 📸 Configuration de Multer pour l'upload de photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 🔍 Recherche d'utilisateur
router.get('/search', searchUser);

// 👤 Récupération du profil
router.get('/profile/:id', getProfile);

// ✏️ Mise à jour du profil avec photo
router.put('/:id', upload.single('photo'), updateUser);

export default router;
