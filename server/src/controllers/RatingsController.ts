import { Request, Response } from "express";
import prisma from "../config/prisma";

class RatingsController {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body;

      const newRating = await prisma.ratings.create({
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async toggle(request: Request, response: Response) {
    try {
      const { user_id, solution_id } = request.body;

      if (!user_id || !solution_id) {
        return response.status(400).json({ success: false, message: "Missing user_id or solution_id" });
      }

      const existing = await prisma.ratings.findFirst({
        where: { user_id, solution_id },
      });

      if (existing) {
        await prisma.ratings.delete({ where: { id: existing.id } });
        const count = await prisma.ratings.count({ where: { solution_id } });
        return response.json({ success: true, rated: false, count });
      } else {
        await prisma.ratings.create({ data: { user_id, solution_id } });
        const count = await prisma.ratings.count({ where: { solution_id } });
        return response.json({ success: true, rated: true, count });
      }
    } catch (error) {
      return response.status(500).json({ success: false, message: "Something went wrong" });
    }
  }

  static async index(request: Request, response: Response) {
    try {
      const { user_id } = request.params;

      const userRating = await prisma.ratings.findMany({
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
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default RatingsController;
