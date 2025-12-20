import type { Request, Response } from 'express';
import CommonGear from '../models/CommonGear.js';

export async function getCommonGearList(req: Request, res: Response) {
    try {
        const list = await CommonGear.find();

        if (!list) {
            return res
                .status(404)
                .json({ message: 'There was an issue fetching the common gear list' });
        }

        res.json(list);
    } catch (err) {
        console.error('Error fetching common gear items:', err);
        res.status(500).json({ message: 'Server error fetching common gear items' });
    }
}
