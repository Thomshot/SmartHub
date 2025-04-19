import express from 'express';
import { searchUser } from '../controllers/user.controller';

const router = express.Router();

// Route for searching users by login
router.get('/search', searchUser);

export default router;
