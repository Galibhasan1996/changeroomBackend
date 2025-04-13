import { config } from "../../util/EnvVariabe.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../../model/Auth/userModel/UserModel.js";
import { customConsole } from "../../util/Util.js";
dotenv.config();

export const Auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Only check Authorization header

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found in the request headers"
            });
        }

        const userOBJ = JWT.verify(token, config.get("JWT_SECRET"));
        customConsole("🚀 ~ AuthMiddleware.js:19 ~ Auth ~ userOBJ:", userOBJ._id)



        if (!userOBJ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid Token"
            });
        }


        // const user = await UserModel.findById(userOBJ?._id?._id);
        const user = await UserModel.findById(userOBJ?._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        req.user = user;
        // console.log("🚀 ~ AuthMiddleware.js:40 ~ Auth ~ user:", req.user)

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token Expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else {
            console.error("JWT Verification Error:", error);
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    }
};




export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Only check Authorization header

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found in the request headers"
            });
        }

        const userOBJ = JWT.verify(token, config.get("JWT_SECRET"));
        // console.log("🚀 ~ Auth ~ userOBJ:", userOBJ._id._id)


        if (!userOBJ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid Token"
            });
        }


        const user = await UserModel.findById(userOBJ._id._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found"
            });
        }

        if (user.isAdmin === false) {
            return res.status(401).json({
                success: false,
                message: "you are not admin"
            });
        }


        req.user = user;
        // console.log(req.user);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token Expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid Token" });
        } else {
            console.error("JWT Verification Error:", error);
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    }
};