"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AiController {
    static async question(request, response) {
        try {
            const { prompt } = await request.body;
            console.log(prompt);
            const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
            });
            const result = await model.generateContent(prompt);
            const res = await result.response;
            return response.json({ success: true, message: res.text() });
        }
        catch (error) {
            return response.json(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
}
exports.default = AiController;
