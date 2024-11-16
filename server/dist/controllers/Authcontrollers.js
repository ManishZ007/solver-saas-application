"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class AuthControllers {
    static async createUser(request, response) {
        try {
            const body = request.body;
            let user = await prisma_1.default.user.findUnique({
                where: {
                    email: body.email,
                },
            });
            if (user == null) {
                user = await prisma_1.default.user.create({
                    data: body,
                });
            }
            return response
                .status(201)
                .json({ success: true, message: "user created successfully!" });
        }
        catch (error) {
            return response.json(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async checkUsernameAvailable(request, response) {
        try {
            const body = request.body;
            const checkUsername = await prisma_1.default.user.findUnique({
                where: {
                    username: body.username,
                },
            });
            if (checkUsername) {
                return response.status(409).json({
                    success: false,
                    message: "username already taken",
                });
            }
            return response.status(200).json({
                success: true,
                message: "username is available",
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async checkEmailAvailable(request, response) {
        try {
            const body = request.body;
            const checkEmail = await prisma_1.default.user.findUnique({
                where: {
                    email: body.email,
                },
            });
            if (checkEmail) {
                return response.status(409).json({
                    success: false,
                    message: "email address already in use",
                });
            }
            return response.status(200).json({
                success: true,
                message: "email is avaliable",
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async login(request, response) {
        try {
            const body = request.body;
            const isLogin = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: { contains: body.identifier } },
                        { username: { contains: body.identifier } },
                    ],
                },
            });
            if (isLogin == null) {
                return response.json({
                    success: false,
                    message: "user not found",
                });
            }
            return response.status(200).json({
                success: true,
                message: "user found successfully",
                user: isLogin,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async getUserByEmail(request, response) {
        try {
            const body = request.body;
            const user = await prisma_1.default.user.findUnique({
                where: {
                    email: body.email,
                },
            });
            if (user === null) {
                return response.json({
                    success: false,
                    message: "user not found",
                });
            }
            return response.json({
                success: true,
                message: "user found success: fully",
                data: user,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
}
exports.default = AuthControllers;
