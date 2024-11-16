import { Request, Response } from "express";
import prisma from "../config/prisma";

class SolutionController {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body;
      const newSolution = await prisma.solutions.create({
        data: {
          username: body.username,
          solution: body.solution,
          post_id: body.post_id,
        },
      });

      if (!newSolution) {
        return response.status(400).json({
          success: false,
          message: "somthing went wrong while creating a post",
        });
      }

      return response.status(201).json({
        success: true,
        message: "solution posted successfully",
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default SolutionController;
