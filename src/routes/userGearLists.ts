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

// GEAR LIST ROUTES - Each userGearList document contains the gear list's metadata (listTitle, etc.)
// and an 'items' array that contains gear items.

router.get('/', getUserGearLists);

router.get('/gear-list/:listId', getUserGearListById);

router.post('/gear-list', createGearList);

router.put('/gear-list/:listId', updateGearListMetadata);

router.delete('/gear-list/:listId', deleteGearList);

// GEAR LIST 'ITEMS' ROUTES - Create, update, and delete items in a userGearList's 'items' array.
// These are the list items that are displayed to the user on the gear list details page.

router.post('/gear-list/:listId/items', addItemToGearList);

router.put('/gear-list/:listId/items/:itemId', updateGearListItem);

router.delete('/gear-list/:listId/items/:itemId', deleteItemFromGearList);

export default router;
