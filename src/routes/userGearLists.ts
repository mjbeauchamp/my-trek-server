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

// Fetch all user gear lists
router.get('/', getUserGearLists);

// Get gear list by ID
router.get('/gear-list/:listId', getUserGearListById);

// Create a new gear list
router.post('/gear-list', createGearList);

// Edit gear list metadata
router.put('/gear-list/:listId', updateGearListMetadata);

// Delete gear list
router.delete('/gear-list/:listId', deleteGearList);

// GEAR LIST ITEMS

// Add item to gear list
router.post('/gear-list/:listId/items', addItemToGearList);

// Edit gear list item
router.put('/gear-list/:listId/items/:itemId', updateGearListItem);

// Delete gear list item
router.delete('/gear-list/:listId/items/:itemId', deleteItemFromGearList);

export default router;
