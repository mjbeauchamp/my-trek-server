import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import validator from 'validator';

import User from '../models/User.js';
import UserGearList from '../models/UserGearList.js';
import { IGearList } from '../models/UserGearList.js';
import {
    sanitizeNewGearItem,
    sanitizePartialGearItem,
    sanitizeGearList,
} from '../utils/validators/gearDataValidator.js';

export async function getUserGearLists(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const lists = await UserGearList.find({ userId: user._id }).sort({ updatedAt: -1 });

        if (!lists) {
            return res.status(404).json({
                message: 'Gear list not found',
            });
        }

        if (!Array.isArray(lists)) {
            console.error('Gear lists data is corrupted');
            return res.status(500).json({ message: 'Gear list data corrupted' });
        }

        res.json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching user gear lists' });
    }
}

export async function getUserGearListById(req: Request, res: Response) {
    try {
        const { listId } = req.params;

        if (!listId) return res.status(400).json({ message: 'List ID parameter not received' });

        if (!listId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid listId' });
        }

        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = await UserGearList.findOne({ userId: user._id, _id: listId });
        // TODO: Deal with it if there's nothing found, or if the data is off or something

        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching user gear lists' });
    }
}

export async function createGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userId = user._id?.toString();
        if (!userId || typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const listData = req.body;

        const sanitizedList = sanitizeGearList(listData);

        if (!sanitizedList.success || !sanitizedList.data) {
            console.warn(`createGearList: Gear list data was invalid: `, sanitizedList.error);
            return res.status(400).json({
                message: `There was a problem creating this gear list: ${sanitizedList.error}`,
            });
        }

        const newList: IGearList = {
            userId,
            listTitle: sanitizedList.data.listTitle,
            listDescription: sanitizedList.data.listDescription,
            items: sanitizedList.data.items,
        };

        const newGearList = await UserGearList.create(newList);

        if (!newGearList) {
            return res.status(404).json({
                message: 'There was an issue creating gear list. Gear list not found',
            });
        }

        const gearListData = {
            listTitle: newGearList.listTitle,
            listDescription: newGearList.listDescription,
            items: newGearList.items,
            _id: newGearList._id,
        };

        res.status(201).json(gearListData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating new gear list' });
    }
}

export async function updateGearListMetadata(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { listId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ message: 'Invalid gear list ID' });
        }

        const { listTitle, listDescription } = req.body;

        if (!listTitle)
            return res
                .status(400)
                .json({ message: 'Missing list title data. List title is required.' });

        const updateData: Partial<{ listTitle: string; listDescription?: string }> = {};

        // Validate and sanitize list title
        if (typeof listTitle !== 'string') {
            console.warn(`List title invalid: listTitle=${listTitle}`);
            return res.status(400).json({ message: 'Invalid list title format' });
        }
        if (listTitle.length > 60) {
            console.warn(`List title length invalid: length=${listTitle.length}`);
            return res.status(400).json({ message: 'List title too long' });
        }
        const normalizedListTitle = validator.trim(listTitle);

        if (!normalizedListTitle) {
            console.warn(`List title format invalid: listTitle=${listTitle}`);
            return res.status(400).json({ message: 'List title formatting incorrect' });
        }

        updateData.listTitle = normalizedListTitle;

        // Validate and sanitize list description
        if (listDescription !== undefined) {
            if (typeof listDescription !== 'string') {
                console.warn(`User list description invalid: description=${listDescription}`);
                return res.status(400).json({ message: 'Invalid list description format' });
            }
            if (listDescription.length > 250) {
                console.warn(`List description length invalid: length=${listDescription.length}`);
                return res.status(400).json({ message: 'List description too long' });
            }
            const normalizedListDescription = validator.trim(listDescription);
            updateData.listDescription = normalizedListDescription ? normalizedListDescription : '';
        }

        const updatedList = await UserGearList.findOneAndUpdate(
            { _id: listId, userId: user._id },
            { $set: updateData },
            { new: true },
        );

        if (!updatedList) {
            throw new Error('List not found or not authorized');
        }

        return res.status(200).json(updatedList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating gear list' });
    }
}

export async function deleteGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { listId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ message: 'Invalid gear list ID' });
        }

        const deletedList = await UserGearList.findByIdAndDelete(listId);

        if (!deletedList) {
            return res.status(404).json({ message: 'List not found' });
        }

        return res.status(200).json({ message: 'List deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error when deleting gear list' });
    }
}

export async function addItemToGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { listId } = req.params;
        const { itemData } = req.body;

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            console.warn('listId param is not a valid ObjectId type at addItemToGearList.');
            return res.status(400).json({ message: 'Invalid listId' });
        }

        const sanitizedData = sanitizeNewGearItem(itemData);

        if (!sanitizedData.success) {
            console.warn(
                `New gear item data was invalid in addItemToGearList: `,
                sanitizedData.error,
            );
            return res.status(400).json({
                message: `There was a problem adding this item to the gear list: ${sanitizedData.error}`,
            });
        }

        const updatedList = await UserGearList.findOneAndUpdate(
            { _id: listId, userId: user._id },
            { $push: { items: sanitizedData.data } },
            { new: true },
        );

        if (!updatedList) {
            return res.status(404).json({
                message: 'Gear list not found',
            });
        }

        if (!Array.isArray(updatedList.items)) {
            console.error('Gear list items field corrupted', listId);
            return res.status(500).json({ message: 'Gear list data corrupted' });
        }

        const newItem = updatedList.items[updatedList.items.length - 1];
        return res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding item to gear list' });
    }
}

export async function updateGearListItem(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { listId, itemId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(listId)) {
            console.warn('listId param is not a valid ObjectId type at updateGearListItem.');
            return res.status(400).json({ message: 'Invalid listId' });
        }
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            console.warn('itemId param is not a valid ObjectId type at updateGearListItem.');
            return res.status(400).json({ message: 'Invalid itemId' });
        }
        const { itemData } = req.body;

        const sanitizedData = sanitizePartialGearItem(itemData);

        if (!sanitizedData.success) {
            console.warn(
                `Updated gear item data was invalid in updateGearListItem: `,
                sanitizedData.error,
            );
            return res.status(400).json({
                message: `There was a problem updating this item in the gear list: ${sanitizedData.error}`,
            });
        }

        const updates: Record<string, string | number> = {};

        for (const [key, value] of Object.entries(sanitizedData.data)) {
            updates[`items.$.${key}`] = value;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update.' });
        }

        const updatedList = await UserGearList.findOneAndUpdate(
            { _id: listId, userId: user._id, 'items._id': itemId },
            { $set: updates },
            { new: true },
        );

        if (!updatedList) {
            return res.status(404).json({ message: 'List or item not found' });
        }

        return res.status(200).json(updatedList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating gear list item' });
    }
}

export async function deleteItemFromGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { listId, itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ message: 'Invalid database object ID' });
        }

        const result = await UserGearList.updateOne(
            { _id: listId },
            { $pull: { items: { _id: itemId } } },
        );

        let message = '';

        if (result.modifiedCount === 0) {
            message = 'No item deleted — maybe list or item not found';
            console.log('No item deleted — maybe list or item not found');
        } else {
            message = 'Item deleted successfully!';
            console.log('Item deleted successfully!');
        }

        return res.status(200).json({ message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting item from gear list' });
    }
}
