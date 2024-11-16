import { Request, Response } from "express";
import prisma from "../config/prisma";

class ChatGroupController {
  static async index(request: Request, response: Response) {
    try {
      const { user_id } = request.params;

      const groups = await prisma.chatGroup.findMany({
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
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const groups = await prisma.chatGroup.findUnique({
        where: {
          id: id,
        },
      });

      return response.json({
        success: true,
        message: "chat group fetched successfully",
        data: groups,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async store(request: Request, response: Response) {
    try {
      const body = request.body;

      const group = await prisma.chatGroup.create({
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
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const body = request.body;
      const { id } = request.params;

      const groups = await prisma.chatGroup.update({
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
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      await prisma.chatGroup.delete({
        where: {
          id: id,
        },
      });

      return response.json({
        success: true,
        message: "chat group deleted successfully",
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default ChatGroupController;
