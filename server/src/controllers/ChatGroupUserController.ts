import { Request, Response } from "express";
import prisma from "../config/prisma";

interface GroupUserType {
  username: string;
  group_id: string;
}

class ChatGroupUserController {
  static async index(request: Request, response: Response) {
    try {
      const { group_id } = request.query;

      const users = await prisma.groupUsers.findMany({
        where: {
          group_id: group_id as string,
        },
      });

      return response.json({
        success: true,
        message: "Data fetch successfully",
        data: users,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async store(request: Request, response: Response) {
    try {
      const body: GroupUserType = request.body;

      const user = await prisma.groupUsers.create({
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default ChatGroupUserController;
