import { Router } from "express";
import { getCommonGearList } from "../controllers/commonGearController.ts";

const router = Router();

// Fetch list of commonly used gear
router.get("/", getCommonGearList);

export default router;