import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


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

import errorHandler from "./middlewares/errorHandler.js"
import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter)

// app.use(errorHandler)

export default app;