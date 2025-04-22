import express from 'express';
import { searchDevice, createDevice, getDevices } from '../controllers/device.controller';

const router = express.Router();

// Define the route for searching devices
router.get('/search', searchDevice);

// Define the route for creating a device
router.post('/create', async (req, res) => {
    console.log('📥 Requête POST reçue sur /create');
    try {
        await createDevice(req, res);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Erreur dans la route /create :', errorMessage);
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
});

// Define the route for retrieving all devices
router.get('/', getDevices);

export default router;
