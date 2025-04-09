import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";


const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1] || req.cookies.accessToken || req.body.accessToken || req.query.accessToken;
    if (!token) {
        return next(new ApiError(401, "Access token is required"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new ApiError(401, "Invalid access token"));
        }

        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        if (user.accessToken !== token) {
            return next(new ApiError(401, "Invalid access token"));
        }
        req.user = user;
        await user.save({ validateBeforeSave: false });
        next();
    } catch (error) {
        return next(new ApiError(401, "Invalid access token"));
    }
}


export default verifyToken;