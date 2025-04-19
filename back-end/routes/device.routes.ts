import express from 'express';
import { searchDevice } from '../controllers/device.controller';

const router = express.Router();

// Define the route for searching devices
router.get('/search', searchDevice);

export default router;
