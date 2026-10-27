"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class LeaderboardController {
    static async index(_req, res) {
        try {
            // Get top users by total ratings received on their solutions
            const topUsers = await prisma_1.default.$queryRaw `
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
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.default = LeaderboardController;
