import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

class AiController {
  static async question(request: Request, response: Response) {
    try {
      const { prompt } = await request.body;
      console.log(prompt);
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent(prompt);

      const res = await result.response;

      return response.json({ success: true, message: res.text() });
    } catch (error) {
      return response.json(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default AiController;
