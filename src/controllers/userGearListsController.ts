import type { Request, Response} from 'express'
import mongoose from 'mongoose';
import User from "../models/User";
import UserGearList from '../models/UserGearList';

export async function getUserGearLists(req: Request, res: Response) {
  try {
    const sub = req.auth?.payload.sub;
    if (!sub) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ auth0Id: sub });
    if (!user) return res.status(404).json({ message: "User not found" });

    const lists = await UserGearList.find({ userId: user._id })
      .sort({ updatedAt: -1 });

    res.json(lists);

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error fetching user gear lists" });
  }
}

export async function getUserGearListById(req: Request, res: Response) {
  try {
    const { listId } = req.params;

    if (!listId) return res.status(400).json({ message: "List ID parameter not received" });

    if (!listId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid listId" });
    }

    const sub = req.auth?.payload.sub;
    if (!sub) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ auth0Id: sub });
    if (!user) return res.status(404).json({ message: "User not found" });

    const list = await UserGearList.findOne({ userId: user._id, _id: listId });
    // TODO: Deal with it if there's nothing found, or if the data is off or something

    res.json(list);

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error fetching user gear lists" });
  }
}

export async function createGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { listTitle, listDescription, items } = req.body;

        const newGearList = await UserGearList.create({
        userId: user._id,
        listTitle,
        listDescription,
        items,
        });

        const gearListData = {
            listTitle: newGearList.listTitle,
            listDescription: newGearList.listDescription,
            items: newGearList.items,
            _id: newGearList._id
        }

        res.status(201).json(gearListData);
    } catch (err) {
        res.status(500).json({ message: "Server error creating new gear list" });
    }
}

export async function addItemToGearList(req: Request, res: Response) {
    try {
        const sub = req.auth?.payload.sub;
        if (!sub) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ auth0Id: sub });
        if (!user) return res.status(404).json({ message: "User not found" });

        const {listId} = req.params;
        const { itemData } = req.body;

        //TODO: Validate and clean up itemData, check for threats etc

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ message: "Invalid listId" });
        }

        const list = await UserGearList.findOne({ _id: listId, userId: user._id });

        if (!list) return res.status(404).json({ message: "List not found" });

        list.items.push(itemData);

        await list.save();

        const newItem = list.items[list.items.length - 1];
        return res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: "Server error adding item to gear list" });
    }
}