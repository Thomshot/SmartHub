import express from 'express';
import multer from 'multer';
import path from 'path';
import { searchUser, getProfile, updateUser, deleteUser, addDeviceToUser } from '../controllers/user.controller';
import { requestDeleteDevice,updateDeviceStatus } from '../controllers/device.controller';

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

router.delete('/:id', deleteUser);

router.post('/:id/add-device', addDeviceToUser);

router.post('/:id/remove-device', requestDeleteDevice);

router.put('/:userId/devices/:deviceId/status', updateDeviceStatus);
export default router;
