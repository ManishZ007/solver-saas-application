import { Request, Response } from "express";
import axios from "axios";

class AiController {
  static async question(request: Request, response: Response) {
    try {
      const { prompt } = request.body;
      console.log("Prompt:", prompt);

      if (!prompt) {
        return response.status(400).json({
          success: false,
          message: "Prompt is required.",
        });
      }

      // Send request to Ollama local API
      const ollamaResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3:latest", // model name you downloaded
          prompt: prompt, // your user prompt
          stream: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const message =
        ollamaResponse.data?.response || "No response from Ollama.";

      console.log(message);

      // Ollama streams responses, so 'response' property contains final output
      return response.json({
        success: true,
        message,
      });
    } catch (error: any) {
      console.error("Ollama Error:", error?.message || error);
      return response.status(500).json({
        success: false,
        message: "Something went wrong, please try again later!",
      });
    }
  }
}

export default AiController;
