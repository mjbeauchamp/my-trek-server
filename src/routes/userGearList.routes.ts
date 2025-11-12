import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import User from "../models/User.js";
import UserGearList from "../models/UserGearList.js";

const router = Router();

// ✅ Auth0 middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: "RS256",
});

router.use(jwtCheck);

// Utility to ensure user exists in DB
async function ensureUser(auth0Id: string, email?: string) {
  let user = await User.findOne({ auth0Id });
  if (!user) {
    user = await User.create({ auth0Id, email });
  }
  return user;
}

// GET /api/gear-lists → fetch all gear lists for logged-in user
router.get("/", async (req: any, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload.email;

    await ensureUser(auth0Id, email);

    const lists = await UserGearList.find({ userId: auth0Id });
    res.json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/gear-lists → create a new gear list
router.post("/", async (req: any, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload.email;
    const { name, items } = req.body;

    await ensureUser(auth0Id, email);

    const newList = await UserGearList.create({
      userId: auth0Id,
      name,
      items: items || [],
    });

    res.status(201).json(newList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/gear-lists/:id/items → add an item to an existing list
router.patch("/:id/items", async (req: any, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { id } = req.params;
    const { item } = req.body; // { name, category?, weight?, notes? }

    // make sure the list belongs to this user
    const list = await UserGearList.findOne({ _id: id, userId: auth0Id });
    if (!list) return res.status(404).json({ message: "List not found" });

    list.items.push(item);
    await list.save();

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
