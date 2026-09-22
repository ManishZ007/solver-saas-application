import { Request, Response } from "express";
import prisma from "../config/prisma";

class PostController {
  static async create(request: Request, resposne: Response) {
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

      const newPost = await prisma.posts.create({
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
    } catch (error) {
      return resposne.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async index(request: Request, response: Response) {
    try {
      const posts = await prisma.posts.findMany({
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async sort(request: Request, response: Response) {
    try {
      const { user_id } = request.query;

      const user_post = await prisma.posts.findMany({
        where: {
          user_id: user_id as string,
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async single(request: Request, response: Response) {
    try {
      const { id } = request.query;

      const post = await prisma.posts.findUnique({
        where: {
          id: id as string,
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { title, description } = request.body;

      const updated = await prisma.posts.update({
        where: { id },
        data: { title, description },
      });

      return response.json({ success: true, message: "Post updated successfully", post: updated });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }

  static async destroy(request: Request, response: Response) {
    try {
      const { id } = request.params;
      await prisma.posts.delete({ where: { id } });
      return response.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }
}

export default PostController;
