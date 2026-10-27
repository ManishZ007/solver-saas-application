import { Request, Response } from "express";
import prisma from "../config/prisma";

class NotificationController {
  static async index(req: Request, res: Response) {
    try {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ success: false, message: "user_id required" });

      const notifications = await prisma.notifications.findMany({
        where: { user_id: user_id as string },
        orderBy: { created_at: "desc" },
        take: 30,
      });

      return res.json({ success: true, notifications });
    } catch {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const { user_id } = req.body;
      await prisma.notifications.updateMany({
        where: { user_id, is_read: false },
        data: { is_read: true },
      });
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
}

export default NotificationController;
