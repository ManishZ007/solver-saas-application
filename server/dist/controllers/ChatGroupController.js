"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class ChatGroupController {
    static async index(request, response) {
        try {
            const { user_id } = request.params;
            const groups = await prisma_1.default.chatGroup.findMany({
                where: {
                    user_id: user_id,
                },
                orderBy: {
                    created_at: "desc",
                },
            });
            return response.json({
                data: groups,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async show(request, response) {
        try {
            const { id } = request.params;
            const groups = await prisma_1.default.chatGroup.findUnique({
                where: {
                    id: id,
                },
            });
            return response.json({
                success: true,
                message: "chat group fetched successfully",
                data: groups,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async store(request, response) {
        try {
            const body = request.body;
            const group = await prisma_1.default.chatGroup.create({
                data: {
                    title: body.title,
                    password: body.password,
                    user_id: body.user_id,
                },
            });
            return response.json({
                success: true,
                message: "chat group created successfully",
                newGroup_id: group.id,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async update(request, response) {
        try {
            const body = request.body;
            const { id } = request.params;
            const groups = await prisma_1.default.chatGroup.update({
                data: {
                    title: body.title,
                    password: body.password,
                },
                where: {
                    id: id,
                },
            });
            return response.json({
                success: true,
                message: "chat group updated successfully",
                data: groups,
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async delete(request, response) {
        try {
            const { id } = request.params;
            await prisma_1.default.chatGroup.delete({
                where: {
                    id: id,
                },
            });
            return response.json({
                success: true,
                message: "chat group deleted successfully",
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
exports.default = ChatGroupController;
