import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log("MongoDB URL",process.env.MONGODB_URI)


export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}