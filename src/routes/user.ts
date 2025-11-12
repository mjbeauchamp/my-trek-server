import { Router } from "express";
import {getOrCreateUser} from "../controllers/userController.ts"

const router = Router();

// Fetch user data
router.post("/", getOrCreateUser);

export default router;