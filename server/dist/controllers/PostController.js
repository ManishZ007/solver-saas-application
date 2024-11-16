"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class PostController {
    static async create(request, resposne) {
        try {
            const body = request.body;
            const postImage = request.file.filename;
            const newPostObject = {
                title: body.title,
                username: body.username,
                description: body.description,
                user_id: body.user_id,
                post_image: postImage,
                publish: body.publish === "true" ? true : false,
            };
            const newPost = await prisma_1.default.posts.create({
                data: newPostObject,
            });
            if (!newPost) {
                return resposne.status(400).json({
                    success: false,
                    message: "somthing went wrong while creating a post",
                });
            }
            return resposne.status(201).json({
                success: true,
                message: "post created successfully",
            });
        }
        catch (error) {
            return resposne.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async index(request, response) {
        try {
            const posts = await prisma_1.default.posts.findMany({
                where: {
                    publish: true,
                },
                orderBy: {
                    created_at: "desc",
                },
                include: {
                    Solutions: {
                        orderBy: {
                            created_at: "desc",
                        },
                        include: {
                            Ratings: true,
                        },
                    },
                },
            });
            return response.json({
                success: true,
                message: "data fetch successfully",
                data: posts,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async sort(request, response) {
        try {
            const { user_id } = request.query;
            const user_post = await prisma_1.default.posts.findMany({
                where: {
                    user_id: user_id,
                },
                orderBy: {
                    created_at: "desc",
                },
                include: {
                    Solutions: {
                        orderBy: {
                            created_at: "desc",
                        },
                        include: {
                            Ratings: true,
                        },
                    },
                },
            });
            return response.json({
                data: user_post,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: "somthing went wrong please try again latter!",
            });
        }
    }
    static async single(request, response) {
        try {
            const { id } = request.query;
            const post = await prisma_1.default.posts.findUnique({
                where: {
                    id: id,
                },
                include: {
                    Solutions: {
                        orderBy: {
                            created_at: "desc",
                        },
                        include: {
                            Ratings: true,
                        },
                    },
                },
            });
            return response.json({
                success: true,
                message: "data fetch successfully",
                post: post,
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
exports.default = PostController;
