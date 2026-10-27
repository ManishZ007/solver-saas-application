import { Request, Response } from "express";
import prisma from "../config/prisma";

class UserStatsController {
  static async index(req: Request, res: Response) {
    try {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ success: false, message: "user_id required" });

      // Resolve username from user_id for solutions (Solutions table uses username not user_id)
      const userRecord = await prisma.user.findUnique({
        where: { id: user_id as string },
        select: { username: true },
      });
      const username = userRecord?.username ?? "";

      const [
        totalPosts,
        solvedPosts,
        totalSolutions,
        totalRatings,
        contestPoints,
        contestsJoined,
      ] = await Promise.all([
        prisma.posts.count({ where: { user_id: user_id as string } }),
        prisma.posts.count({ where: { user_id: user_id as string, is_solved: true } }),
        prisma.solutions.count({ where: { username } }),
        prisma.ratings.count({ where: { user_id: user_id as string } }),
        prisma.contestParticipant.aggregate({
          _sum: { total_points: true },
          where: { user_id: user_id as string },
        }),
        prisma.contestParticipant.count({ where: { user_id: user_id as string } }),
      ]);

      return res.json({
        success: true,
        stats: {
          totalPosts,
          solvedPosts,
          totalSolutions,
          totalRatings,
          contestPoints: contestPoints._sum.total_points ?? 0,
          contestsJoined,
        },
      });
    } catch {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
}

export default UserStatsController;
