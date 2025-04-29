import express from 'express';
import { getAllDevices, searchDevice, createDevice, requestDeleteDevice, updateDeviceStatus, clearUserDevices } from '../controllers/device.controller';

const router = express.Router();

// Route pour rechercher des appareils
router.get('/search', searchDevice);

router.get('/', getAllDevices);

router.get('/test', (req, res) => {
    res.send('✅ Route /api/devices/test atteinte');
});

// Route pour créer un nouvel appareil
router.post('/create', (req, res, next) => {
    console.log('Route /create atteinte');
    next();
  }, createDevice);

router.post('/request-delete', requestDeleteDevice);

router.post('/users/:id/clear-devices', clearUserDevices);

export default router;