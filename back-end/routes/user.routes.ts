import express from 'express';
import multer from 'multer';
import path from 'path';
import { searchUser, getProfile, updateUser, deleteUser, getUserPoints} from '../controllers/user.controller'; // ✨ Ajout de getUserPoints
import { requestDeleteDevice,updateDeviceStatus, updateUserDeviceName, addDeviceToUser  } from '../controllers/device.controller';

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

// ✨ Récupération des points d'un utilisateur
router.get('/profile/:id/points', getUserPoints); // ⬅️ AJOUTE CETTE ROUTE ICI

// ✏️ Mise à jour du profil avec photo
router.put('/:id', upload.single('photo'), updateUser);

// ❌ Suppression utilisateur
router.delete('/:id', deleteUser);

router.post('/:id/add-device', addDeviceToUser);

router.post('/:id/remove-device', requestDeleteDevice);

router.put('/:userId/devices/:deviceId/status', updateDeviceStatus);
router.put('/:userId/devices/:userDeviceId/name', updateUserDeviceName);

export default router;
