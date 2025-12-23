import express from 'express';
import { connectDB } from './database/db.js';
import commonGearRoutes from './routes/commonGear.js';
import backpackingArticlesRoutes from './routes/backpackingArticles.js';
import userRoutes from './routes/user.js';
import userGearLists from './routes/userGearLists.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';

interface AppError extends Error {
    status?: number;
}

dotenv.config();

const requiredEnv = ['FRONTEND_URL', 'AUTH0_AUDIENCE', 'AUTH0_DOMAIN'];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
);

// Auth0 auth check middleware
const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGN_ALG,
});

app.use(express.json());

app.use('/api/user', jwtCheck, userRoutes);

app.use('/api/gear-lists', jwtCheck, userGearLists);

app.use('/api/commonGear', commonGearRoutes);

app.use('/api/backpacking-articles', backpackingArticlesRoutes);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: AppError, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const status = err.status ? err.status : 500;
        if (err.name === 'InvalidRequestError') {
            return res.status(status).json({ message: 'Invalid Request' });
        }
        console.error(err);
        res.status(status).json({ message: 'Server error' });
    },
);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('There was an error connecting to database: ', error);
        process.exit(1);
    }
};

startServer();
