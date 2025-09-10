import express from "express";
import { connectDB } from "./config/db.ts";
import commonGearRoutes from "./routes/commonGear.routes.ts";
import cors from "cors";
import { auth } from 'express-oauth2-jwt-bearer'
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGN_ALG
});

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

app.use(express.json());

app.use("/api/commonGear", jwtCheck, commonGearRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});