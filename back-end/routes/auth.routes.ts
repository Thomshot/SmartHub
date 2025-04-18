import express from 'express';
import { registerUser, loginUser, verifyEmail, updatePoints } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/multer.config';

const router = express.Router();

router.post('/register', upload.single('photo'), asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/verify', asyncHandler(verifyEmail));
router.post('/update-points', asyncHandler(updatePoints));

export default router;
