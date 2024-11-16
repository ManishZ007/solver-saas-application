"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ChatController {
    static async getAllChats(request, response) {
        try {
            const { group_id } = request.query;
            const chats = await prisma_1.default.chats.findMany({
                where: {
                    group_id: group_id,
                },
            });
            return response.json({
                success: true,
                message: "all chat fetch successfully",
                data: chats,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
}
exports.default = ChatController;
