import { Router } from "express";
import { getOrCreateUser } from "../controllers/userController.js";


const router = Router();

// Fetch user data
router.post("/", getOrCreateUser);

export default router;