import { Router } from "express";
import { getUserGearLists, createGearList, getUserGearListById } from "../controllers/userGearListsController.ts";


const router = Router();

// Fetch all user gear lists
router.get("/", getUserGearLists);

// Create a new gear list
router.post("/gear-list", createGearList);

// Get gear list by ID
router.post("/gear-list/:listId", getUserGearListById);

export default router;