import type { Request, Response } from "express";
import CommonGear from "../models/CommonGear";

export async function getCommonGearList(req: Request, res: Response) {
    try {
        const gear = await CommonGear.find();
        res.json(gear);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}