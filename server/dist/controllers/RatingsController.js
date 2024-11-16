"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class RatingsController {
    static async create(request, response) {
        try {
            const body = request.body;
            const newRating = await prisma_1.default.ratings.create({
                data: {
                    user_id: body.user_id,
                    solution_id: body.solution_id,
                },
            });
            if (!newRating) {
                return response.status(400).json({
                    success: false,
                    message: "somthing went wong while create a rating",
                });
            }
            return response.status(201).json({
                success: true,
                message: "post like successfully",
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
    static async index(request, response) {
        try {
            const { user_id } = request.params;
            const userRating = await prisma_1.default.ratings.findMany({
                where: {
                    user_id: user_id,
                },
            });
            if (!userRating) {
                return response.status(404).json({
                    success: false,
                    message: "cannot found the user rating",
                });
            }
            return response.status(200).json({
                success: true,
                message: "user rating found successfully",
                rating: userRating,
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
exports.default = RatingsController;
