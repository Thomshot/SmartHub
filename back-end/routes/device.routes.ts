import express from 'express';
import { getAllDevices, searchDevice, createDevice, updateDeviceStatus } from '../controllers/device.controller';

const router = express.Router();

// Route pour rechercher des appareils
router.get('/search', searchDevice);

router.get('/all', getAllDevices);

router.get('/test', (req, res) => {
    res.send('✅ Route /api/devices/test atteinte');
});

// Route pour créer un nouvel appareil
router.post('/create', (req, res, next) => {
    console.log('Route /create atteinte');
    next();
  }, createDevice);

// Route pour mettre à jour le statut d'un objet
router.post('/update-status', updateDeviceStatus);

export default router;