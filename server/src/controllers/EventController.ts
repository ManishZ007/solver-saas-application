import { Request, response, Response } from "express";
import prisma from "../config/prisma";

class EventController {
  static async index(request: Request, response: Response) {
    try {
      const { user_id } = request.query;
      const events = await prisma.events.findMany({
        where: {
          user_id: user_id as string,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return response.json({
        success: true,
        message: "successfully fetch all events",
        events: events,
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
      const { payload } = await request.body;

      await prisma.events.create({
        data: payload,
      });

      return response.json({
        success: true,
        message: "event created successfully",
      });
    } catch (error) {
      return response.json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default EventController;
