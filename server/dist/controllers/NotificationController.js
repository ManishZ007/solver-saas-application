"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class NotificationController {
    static async index(req, res) {
        try {
            const { user_id } = req.query;
            if (!user_id)
                return res.status(400).json({ success: false, message: "user_id required" });
            const notifications = await prisma_1.default.notifications.findMany({
                where: { user_id: user_id },
                orderBy: { created_at: "desc" },
                take: 30,
            });
            return res.json({ success: true, notifications });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
    static async markRead(req, res) {
        try {
            const { user_id } = req.body;
            await prisma_1.default.notifications.updateMany({
                where: { user_id, is_read: false },
                data: { is_read: true },
            });
            return res.json({ success: true });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.default = NotificationController;
