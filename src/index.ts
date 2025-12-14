import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';

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

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigin =
    process.env.NODE_ENV === 'development'
        ? process.env.FRONTEND_URL
        : process.env.PROD_FRONTEND_URL;

app.use(
    cors({
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
);

// Auth0 auth check middleware
const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    tokenSigningAlg: 'RS256',
});

app.use(express.json());
app.use((req, res, next) => {
    if (req.body) {
        mongoSanitize.sanitize(req.body);
    }
    if (req.params) {
        mongoSanitize.sanitize(req.params);
    }
    next();
});

app.use('/api/user', jwtCheck, userRoutes);

app.use('/api/gear-lists', jwtCheck, userGearLists);

app.use('/api/commonGear', commonGearRoutes);

app.use('/api/backpacking-articles', backpackingArticlesRoutes);

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
