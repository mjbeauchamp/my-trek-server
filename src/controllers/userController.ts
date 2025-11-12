import type { Request, Response} from 'express'
import User from "../models/User";

export async function getOrCreateUser(req: Request, res: Response) {
  try {
    const payload = req.auth?.payload as { sub: string };
        //TODO: add error handling if no payload
    const { sub } = payload;
    const {name, email} = req.body;

        //TODO: add error handling if payload, body, or any of the child values are not expected data types

    // Here we fetch the user if it already exists, or we create it in the database
    const user = await User.findOneAndUpdate(
      { auth0Id: sub },
      { $setOnInsert: { name, email } },
      { new: true, upsert: true }
    );

    const userData = {
      name: user.name,
      email: user.email,
      userId: user._id
    };

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user" });
  }
}
