import { Request, Response } from "express";
import prisma from "../config/prisma";

class EventController {
  static async index(request: Request, response: Response) {
    try {
      const { user_id } = request.query;
      const events = await prisma.events.findMany({
        where: { user_id: user_id as string },
        orderBy: { created_at: "desc" },
      });
      return response.json({ success: true, message: "successfully fetch all events", events });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }

  static async store(request: Request, response: Response) {
    try {
      const { payload } = request.body;
      await prisma.events.create({ data: payload });
      return response.json({ success: true, message: "Event created successfully" });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }

  static async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { title, date_of_event } = request.body;

      const updated = await prisma.events.update({
        where: { id },
        data: { title, date_of_event: new Date(date_of_event) },
      });

      return response.json({ success: true, message: "Event updated successfully", event: updated });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }

  static async destroy(request: Request, response: Response) {
    try {
      const { id } = request.params;
      await prisma.events.delete({ where: { id } });
      return response.json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong!" });
    }
  }
}

export default EventController;
