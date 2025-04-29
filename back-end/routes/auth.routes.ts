import express from 'express';
import { registerUser, loginUser, verifyEmail, updatePoints, getLoginHistory } from '../controllers/auth.controller'; // <-- importe aussi getLoginHistory
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/multer.config';

const router = express.Router();

router.post('/register', upload.single('photo'), asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/verify', asyncHandler(verifyEmail));
router.post('/update-points', asyncHandler(updatePoints));

router.get('/login-history', asyncHandler(getLoginHistory)); 

export default router;
