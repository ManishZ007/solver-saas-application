"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class EventController {
    static async index(request, response) {
        try {
            const { user_id } = request.query;
            const events = await prisma_1.default.events.findMany({
                where: { user_id: user_id },
                orderBy: { created_at: "desc" },
            });
            return response.json({ success: true, message: "successfully fetch all events", events });
        }
        catch (error) {
            return response.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
    static async store(request, response) {
        try {
            const { payload } = request.body;
            await prisma_1.default.events.create({ data: payload });
            return response.json({ success: true, message: "Event created successfully" });
        }
        catch (error) {
            return response.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
    static async update(request, response) {
        try {
            const { id } = request.params;
            const { title, date_of_event } = request.body;
            const updated = await prisma_1.default.events.update({
                where: { id },
                data: { title, date_of_event: new Date(date_of_event) },
            });
            return response.json({ success: true, message: "Event updated successfully", event: updated });
        }
        catch (error) {
            return response.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
    static async destroy(request, response) {
        try {
            const { id } = request.params;
            await prisma_1.default.events.delete({ where: { id } });
            return response.json({ success: true, message: "Event deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ success: false, message: "Something went wrong!" });
        }
    }
}
exports.default = EventController;
