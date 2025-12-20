import type { Request, Response } from 'express';
import validator from 'validator';
import User, { IUser } from '../models/User.js';

export async function getOrCreateUser(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload?.sub;
        if (!sub) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updateData: Partial<IUser> = {
            auth0Id: sub,
        };

        const { name, email } = req.body;

        // Validate and sanitize name if provided
        if (name !== undefined) {
            if (typeof name !== 'string') {
                console.warn(`User name invalid`);
                return res.status(400).json({ message: 'Invalid name format' });
            }
            if (name.length > 200) {
                console.warn(`User name length invalid`);
                return res.status(400).json({ message: 'Name too long' });
            }
            const normalizedName = validator.trim(name);
            if (normalizedName) updateData.name = normalizedName;
        }

        // Validate and sanitize email if provided
        if (email !== undefined) {
            if (typeof email !== 'string' || !validator.isEmail(email)) {
                console.warn(`User email invalid.`);
                return res.status(400).json({ message: 'Invalid email format' });
            }
            if (email.length > 255) {
                console.warn(`User email length invalid.`);
                return res.status(400).json({ message: 'Email too long' });
            }
            const normalizedEmail = validator.normalizeEmail(email);
            if (normalizedEmail) updateData.email = normalizedEmail;
        }

        // Here we fetch the user if it already exists, or we create it in the database
        const user = await User.findOneAndUpdate(
            { auth0Id: sub },
            { $setOnInsert: updateData },
            { new: true, upsert: true },
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: 'There was an issue creating or fetching user' });
        }

        // Don't currently need the DB user object in the client, so sending 204
        res.sendStatus(204);
    } catch (err) {
        console.error('Error creating or updating user: ', err);
        res.status(500).json({ message: 'Server error fetching user' });
    }
}
