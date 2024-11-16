"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ChatGroupUserController {
    static async index(request, response) {
        try {
            const { group_id } = request.query;
            const users = await prisma_1.default.groupUsers.findMany({
                where: {
                    group_id: group_id,
                },
            });
            return response.json({
                success: true,
                message: "Data fetch successfully",
                data: users,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async store(request, response) {
        try {
            const body = request.body;
            const user = await prisma_1.default.groupUsers.create({
                data: {
                    username: body.username,
                    group_id: body.group_id,
                },
            });
            return response.json({
                success: true,
                message: "user connected successfully",
                user: user,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
}
exports.default = ChatGroupUserController;
