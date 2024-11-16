"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class UserController {
    static async editUserProfileImage(request, response) {
        try {
            const { user_id } = request.body;
            const image = request.file.filename;
            const formated_image = "http://localhost:8000/uploads/" + image;
            const update_profile = await prisma_1.default.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    profile_image: formated_image,
                },
            });
            if (update_profile == null) {
                return response.status(400).json({
                    success: false,
                    message: "Error while updating the profile image",
                });
            }
            return response.status(200).json({
                success: true,
                meesage: "profile image updated successfully!",
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async updateUser(request, response) {
        try {
            const { email, username, user_id } = request.body;
            const updatedUser = await prisma_1.default.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    email: email,
                    username: username,
                },
            });
            if (updatedUser === null) {
                return response.status(400).json({
                    success: false,
                    message: "Error while updating the profile",
                });
            }
            return response.status(200).json({
                success: true,
                message: "profile updated successfully!",
                data: updatedUser,
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
exports.default = UserController;
