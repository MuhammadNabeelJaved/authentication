import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();


export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/authentication`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}