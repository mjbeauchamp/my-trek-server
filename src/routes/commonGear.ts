import { Router } from 'express';
import { getCommonGearList } from '../controllers/commonGearController.js';

const router = Router();

// Returns a list of commonly used backpacking gear items.
// The list is used by the client to create an item selection dropdown menu for users.
router.get('/', getCommonGearList);

export default router;
