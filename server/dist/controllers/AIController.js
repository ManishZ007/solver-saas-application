"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class AiController {
    static async judgeSolutions(request, response) {
        const { problem, solutions } = request.body;
        if (!problem || !solutions?.length) {
            return response.status(400).json({ success: false, message: "problem and solutions required" });
        }
        const solutionList = solutions
            .map((s, i) => `Solution ${i + 1} by ${s.username}:\n${s.solution}`)
            .join("\n\n---\n\n");
        const prompt = `You are a senior software engineer judging solutions to a coding problem.

Problem: ${problem}

${solutionList}

Evaluate each solution and respond in this exact JSON format:
{
  "winner": { "index": 1, "username": "name", "reason": "why this is best" },
  "rankings": [
    { "index": 1, "username": "name", "score": 95, "correctness": "excellent", "performance": "good", "readability": "great", "feedback": "brief feedback" }
  ],
  "summary": "Overall comparison in 2 sentences"
}

Be concise. Return only valid JSON.`;
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
            const parsed = JSON.parse(text);
            return response.json({ success: true, result: parsed });
        }
        catch {
            return response.status(500).json({ success: false, message: "AI judge failed. Try again." });
        }
    }
    static async question(request, response) {
        const { prompt } = request.body;
        if (!prompt) {
            return response.status(400).json({ success: false, message: "Prompt is required." });
        }
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent(prompt + "\n\nReturn the answer in short, just highlight the actual problem.");
                const message = result.response.text();
                return response.json({ success: true, message });
            }
            catch (error) {
                const is503 = error?.message?.includes("503");
                console.error(`Attempt ${attempt} failed:`, error?.message);
                if (is503 && attempt < maxRetries) {
                    const delay = attempt * 2000;
                    console.log(`Retrying in ${delay / 1000}s...`);
                    await sleep(delay);
                    continue;
                }
                const message = is503
                    ? "AI is currently busy. Please try again in a moment."
                    : "Something went wrong with the AI. Please try again.";
                return response.status(503).json({ success: false, message });
            }
        }
    }
}
exports.default = AiController;
