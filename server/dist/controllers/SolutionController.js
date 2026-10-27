"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
const index_1 = require("../index");
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
                return response.status(400).json({ success: false, message: "Something went wrong while creating solution" });
            }
            // Create notification for post owner
            const post = await prisma_1.default.posts.findUnique({ where: { id: body.post_id } });
            if (post && post.user_id) {
                const notification = await prisma_1.default.notifications.create({
                    data: {
                        user_id: post.user_id,
                        type: "new_solution",
                        message: `${body.username} posted a solution to your problem "${post.title}"`,
                        post_id: body.post_id,
                    },
                });
                // Emit real-time notification to post owner
                index_1.io.emit(`notification:${post.user_id}`, notification);
            }
            return response.status(201).json({ success: true, message: "Solution posted successfully" });
        }
        catch {
            return response.status(500).json({ success: false, message: "Something went wrong. Please try again." });
        }
    }
    static async markSolved(request, response) {
        try {
            const { post_id, solution_id } = request.body;
            await prisma_1.default.posts.update({
                where: { id: post_id },
                data: { is_solved: true, accepted_solution_id: solution_id },
            });
            return response.json({ success: true, message: "Post marked as solved" });
        }
        catch {
            return response.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.default = SolutionController;
