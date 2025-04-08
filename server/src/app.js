import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { connectDB } from './database/database.js';

dotenv.config();
const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;