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
        throw new ApiError(500 || error.message);
    }
}

const register = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log("Registering user:", { username, email, password });

        // Validation checks
        if (!username || !email || !password) {
            throw new ApiError(400, "All fields are required");
        } else if (!email) {
            throw new ApiError(400, "Email is required");
        } else if (!password) {
            throw new ApiError(400, "Password is required");
        } else if (!username) {
            throw new ApiError(400, "Username is required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
        });

        if (!newUser) {
            throw new ApiError(500, "User registration failed");
        }

        // Generate OTP
        const otp = newUser.generateVerificationCode();

        await newUser.save({ validateBeforeSave: false });

        if (!otp) {
            throw new ApiError(500, "Failed to generate verification code");
        }

        // Send verification email with code
        const emailSent = await sendEmail(email, "Verification Code", otp);

        if (!emailSent) {
            throw new ApiError(500, "Failed to send verification email");
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
        throw new ApiError(500 || error.message);
    }
});

const verifyAccount = asyncHandler(async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            throw new ApiError(400, "Verification code is required");
        }

        const user = await User.findOne({
            verificationCode: code,
            verificationCodeExpiry: { $gt: Date.now() },
        }).select("-password -verificationCode -verificationCodeExpiry");

        if (!user) {
            throw new ApiError(400, "Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save({ validateBeforeSave: false });

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Failed to generate tokens");
        }
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(
            new ApiResponse(
                200,
                "Account verified successfully",
                user
            )
        );
    } catch (error) {
        // Using ApiError for error handling
        throw new ApiError(500 || error.message);
    }
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }
        if (!user.isVerified) {
            throw new ApiError(403, "Account not verified");
        }

        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Failed to generate tokens");
        }

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
        }

        return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(
            new ApiResponse(
                200,
                "Login successful",
                user
            )
        )

    } catch (error) {
        throw new ApiError(500 || error.message);
    }
});

export { register, verifyAccount, login };