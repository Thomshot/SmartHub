import express from 'express';
import { getAllDevices, searchDevice, createDevice } from '../controllers/device.controller';

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

export default router;