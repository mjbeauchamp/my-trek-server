import express from "express";
import { connectDB } from "./config/db.ts";
import commonGearRoutes from "./routes/commonGear.ts";
import backpackingArticlesRoutes from "./routes/backpackingArticles.ts";
import userRoutes from "./routes/user.ts";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigin =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Auth0 auth check middleware
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: "RS256",
});

app.use(express.json());

app.use("/api/user", jwtCheck, userRoutes)

app.use("/api/commonGear", commonGearRoutes);

app.use("/api/backpacking-articles", backpackingArticlesRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});