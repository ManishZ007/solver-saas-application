import { Request, Response } from "express";
import prisma from "../config/prisma";

class LeaderboardController {
  static async index(_req: Request, res: Response) {
    try {
      // Get top users by total ratings received on their solutions
      const topUsers = await prisma.$queryRaw<
        Array<{ username: string; user_id: string; total_ratings: bigint; total_solutions: bigint }>
      >`
        SELECT s.username, s.user_id_of_solution as user_id,
               COUNT(r.id) as total_ratings,
               COUNT(DISTINCT s.id) as total_solutions
        FROM (
          SELECT sol.id, sol.username,
                 p.user_id as user_id_of_solution
          FROM solutions sol
          JOIN posts p ON p.id = sol.post_id
        ) s
        LEFT JOIN ratings r ON r.solution_id = s.id
        GROUP BY s.username, s.user_id_of_solution
        ORDER BY total_ratings DESC
        LIMIT 10
      `;

      const formatted = topUsers.map((u, i) => ({
        rank: i + 1,
        username: u.username,
        user_id: u.user_id,
        total_ratings: Number(u.total_ratings),
        total_solutions: Number(u.total_solutions),
      }));

      return res.json({ success: true, leaderboard: formatted });
    } catch {
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
}

export default LeaderboardController;
