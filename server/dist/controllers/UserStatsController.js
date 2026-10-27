"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class UserStatsController {
    static async index(req, res) {
        try {
            const { user_id } = req.query;
            if (!user_id)
                return res.status(400).json({ success: false, message: "user_id required" });
            // Resolve username from user_id for solutions (Solutions table uses username not user_id)
            const userRecord = await prisma_1.default.user.findUnique({
                where: { id: user_id },
                select: { username: true },
            });
            const username = userRecord?.username ?? "";
            const [totalPosts, solvedPosts, totalSolutions, totalRatings, contestPoints, contestsJoined,] = await Promise.all([
                prisma_1.default.posts.count({ where: { user_id: user_id } }),
                prisma_1.default.posts.count({ where: { user_id: user_id, is_solved: true } }),
                prisma_1.default.solutions.count({ where: { username } }),
                prisma_1.default.ratings.count({ where: { user_id: user_id } }),
                prisma_1.default.contestParticipant.aggregate({
                    _sum: { total_points: true },
                    where: { user_id: user_id },
                }),
                prisma_1.default.contestParticipant.count({ where: { user_id: user_id } }),
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
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.default = UserStatsController;
