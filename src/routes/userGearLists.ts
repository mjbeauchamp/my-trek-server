import { Router } from "express";
import { getUserGearLists, createGearList, getUserGearListById, addItemToGearList } from "../controllers/userGearListsController.ts";


const router = Router();

// Fetch all user gear lists
router.get("/", getUserGearLists);

// Get gear list by ID
router.get("/gear-list/:listId", getUserGearListById);

// Create a new gear list
router.post("/gear-list", createGearList);

// Add item to gear list
router.post("/gear-list/:listId/items", addItemToGearList);

export default router;