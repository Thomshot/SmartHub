import express from 'express';
import { getAllServices, searchService } from '../controllers/service.controller';

const router = express.Router();

// Route pour récupérer tous les services
router.get('/', getAllServices);

// Route pour rechercher un service
router.get('/search', searchService);

export default router;
