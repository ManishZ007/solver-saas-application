import { Request, Response } from "express";
import prisma from "../config/prisma";

class ChatController {
  static async getAllChats(request: Request, response: Response) {
    try {
      const { group_id } = request.query;

      const chats = await prisma.chats.findMany({
        where: {
          group_id: group_id as string,
        },
      });

      return response.json({
        success: true,
        message: "all chat fetch successfully",
        data: chats,
      });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default ChatController;
