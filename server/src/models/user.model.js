import dotenv from "dotenv";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    refreshToken: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        default: null,
    },
    verificationCodeExpiry: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateVerificationCode = function () {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    this.verificationCode = code;
    this.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes 
    return code;
}

userSchema.methods.isVerificationCodeValid = function (code) {
    return this.verificationCode === code && this.verificationCodeExpiry > new Date();
}

userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign({ id: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || "10d" });
    this.refreshToken = refreshToken;
    return refreshToken;
}

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign({ id: this._id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1h' });
    return accessToken;
}


const User = model("User", userSchema);
export default User;