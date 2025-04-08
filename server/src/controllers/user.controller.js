import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEail.js";

dotenv.config();


const register = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new ApiError("All fields are required", 400);
        } else if (!email) {
            throw new ApiError("Email is required", 400);
        } else if (!password) {
            throw new ApiError("Password is required", 400);
        } else if (!username) {
            throw new ApiError("Username is required", 400);
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ApiError("User already exists", 400);
        }

        const user = User.create({
            username,
            email,
            password,
        })

        if (!user) {
            throw new ApiError("User registration failed", 500);
        }

        const code = user.generateVerificationCode();

        await user.save({ validateBeforeSave: false });

        // Send verification email with code



    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500);
    }

})