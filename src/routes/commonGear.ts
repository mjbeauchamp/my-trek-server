import { Router } from 'express';
import { getCommonGearList } from '../controllers/commonGearController.js';

const router = Router();

router.get('/', getCommonGearList);

export default router;
