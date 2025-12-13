import { Router } from 'express';
import {
    getUserGearLists,
    createGearList,
    updateGearListMetadata,
    deleteGearList,
    getUserGearListById,
    addItemToGearList,
    updateGearListItem,
    deleteItemFromGearList,
} from '../controllers/userGearListsController.js';

const router = Router();

// GEAR LIST

router.get('/', getUserGearLists);

router.get('/gear-list/:listId', getUserGearListById);

router.post('/gear-list', createGearList);

router.put('/gear-list/:listId', updateGearListMetadata);

router.delete('/gear-list/:listId', deleteGearList);

// GEAR LIST ITEMS

router.post('/gear-list/:listId/items', addItemToGearList);

router.put('/gear-list/:listId/items/:itemId', updateGearListItem);

router.delete('/gear-list/:listId/items/:itemId', deleteItemFromGearList);

export default router;
