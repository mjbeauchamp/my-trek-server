import { Router } from 'express';
import { getOrCreateUser } from '../controllers/userController.js';

const router = Router();

router.post('/', getOrCreateUser);

export default router;
