import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in .env');
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (err: unknown) {
        console.error('MongoDB connection error:', err instanceof Error ? err.message : err);
        process.exit(1);
    }
};
