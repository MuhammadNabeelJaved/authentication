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

        const newUser = User.create({
            username,
            email,
            password,
        })

        if (!newUser) {
            throw new ApiError("User registration failed", 500);
        }

        const code = newUser.generateVerificationCode();

        if (!code) {
            throw new ApiError("Failed to generate verification code", 500);
        }

        // Send verification email with code
        const emailSent = await sendEmail(email, "Verification Code", code)

        if (!emailSent) {
            throw new ApiError("Failed to send verification email", 500);
        }

        const user = await User.findOne({ _id: newUser._id }).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        return res.status(200).json(
            ApiResponse.success(
                200,
                "User registered successfully",
                user,
            )

        )


    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500);
    }

})