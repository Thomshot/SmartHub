import express from 'express';
import { registerUser, loginUser, verifyEmail } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/multer.config';

const router = express.Router();

router.post('/register', upload.single('photo'), asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/verify', asyncHandler(verifyEmail));


export default router;
