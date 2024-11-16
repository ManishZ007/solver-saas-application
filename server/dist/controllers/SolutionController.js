"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class SolutionController {
    static async create(request, response) {
        try {
            const body = request.body;
            const newSolution = await prisma_1.default.solutions.create({
                data: {
                    username: body.username,
                    solution: body.solution,
                    post_id: body.post_id,
                },
            });
            if (!newSolution) {
                return response.status(400).json({
                    success: false,
                    message: "somthing went wrong while creating a post",
                });
            }
            return response.status(201).json({
                success: true,
                message: "solution posted successfully",
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
exports.default = SolutionController;
