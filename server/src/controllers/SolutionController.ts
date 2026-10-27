import { Request, Response } from "express";
import prisma from "../config/prisma";
import { io } from "../index";

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
        return response.status(400).json({ success: false, message: "Something went wrong while creating solution" });
      }

      // Create notification for post owner
      const post = await prisma.posts.findUnique({ where: { id: body.post_id } });
      if (post && post.user_id) {
        const notification = await prisma.notifications.create({
          data: {
            user_id: post.user_id,
            type: "new_solution",
            message: `${body.username} posted a solution to your problem "${post.title}"`,
            post_id: body.post_id,
          },
        });
        // Emit real-time notification to post owner
        io.emit(`notification:${post.user_id}`, notification);
      }

      return response.status(201).json({ success: true, message: "Solution posted successfully" });
    } catch {
      return response.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  }

  static async markSolved(request: Request, response: Response) {
    try {
      const { post_id, solution_id } = request.body;
      await prisma.posts.update({
        where: { id: post_id },
        data: { is_solved: true, accepted_solution_id: solution_id },
      });
      return response.json({ success: true, message: "Post marked as solved" });
    } catch {
      return response.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
}

export default SolutionController;
