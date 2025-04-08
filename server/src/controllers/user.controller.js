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

        // Validation checks
        if (!username || !email || !password) {
            throw new ApiError("All fields are required", 400);
        } else if (!email) {
            throw new ApiError("Email is required", 400);
        } else if (!password) {
            throw new ApiError("Password is required", 400);
        } else if (!username) {
            throw new ApiError("Username is required", 400);
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ApiError("User already exists", 400);
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
        });

        if (!newUser) {
            throw new ApiError("User registration failed", 500);
        }

        // Generate OTP
        const otp = newUser.generateVerificationCode();

        if (!otp) {
            throw new ApiError("Failed to generate verification code", 500);
        }

        // Send verification email with code
        const emailSent = await sendEmail(email, "Verification Code", otp);

        if (!emailSent) {
            throw new ApiError("Failed to send verification email", 500);
        }

        // Return user without sensitive information
        const user = await User.findOne({ _id: newUser._id }).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        return res.status(200).json(
            new ApiResponse(
                200,
                "User registered successfully",
                user
            )
        );

    } catch (error) {
        // Using ApiError for error handling
        throw new ApiError(error.message || "Something went wrong", error.statusCode || 500);
    }
});

const verifyAccount = asyncHandler(async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            throw new ApiError("Verification code is required", 400);
        }

        const user = await User.findOne({
            verificationCode: code,
            verificationCodeExpiry: { $gt: Date.now() },
        }).select("-password");

        if (!user) {
            throw new ApiError("Invalid or expired verification code", 400);
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Account verified successfully",
                user
            )
        );
    } catch (error) {
        // Using ApiError for error handling
        throw new ApiError(error.message || "Something went wrong", error.statusCode || 500);
    }
});

export { register, verifyAccount };