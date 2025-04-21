import express from 'express';
import { recordAction } from '../controllers/actions.controller';

const router = express.Router();

router.post('/record-action', recordAction);

export default router;