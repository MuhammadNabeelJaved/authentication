import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEail.js";

dotenv.config();


const genrateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId).select("-password -refreshToken -verificationCode -verificationCodeExpiry");
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(error.message || "Error occured during genrating access and refresh tokens", error.statusCode || 500);
    }
}

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

        await newUser.save({ validateBeforeSave: false });

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
        }).select("-password -verificationCode -verificationCodeExpiry");

        if (!user) {
            throw new ApiError("Invalid or expired verification code", 400);
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save({ validateBeforeSave: false });

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

        if (!accessToken || !refreshToken) {
            throw new ApiError("Failed to generate tokens", 500);
        }
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Account verified successfully",
                user
            )
        ).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options);
    } catch (error) {
        // Using ApiError for error handling
        throw new ApiError(error.message || "Something went wrong", error.statusCode || 500);
    }
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError("Email and password are required", 400);
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new ApiError("Invalid credentials", 401);
        }
        if (!user.isVerified) {
            throw new ApiError("Account not verified", 403);
        }

        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);
        if (!accessToken || !refreshToken) {
            throw new ApiError("Failed to generate tokens", 500);
        }

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                "Login successful",
                user
            )
        ).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options);

    } catch (error) {
        throw new ApiError(error.message || "Something went wrong", error.statusCode || 500);

    }
});

export { register, verifyAccount };