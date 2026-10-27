"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
class ContestController {
    // ── List all contests ────────────────────────────────────────────────────────
    static async index(_req, res) {
        try {
            const contests = await prisma_1.default.contest.findMany({
                orderBy: { start_time: "desc" },
                include: {
                    Problems: { select: { id: true } },
                    Participants: { select: { id: true } },
                },
            });
            return res.json({ success: true, contests });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
    // ── Single contest with full problems ────────────────────────────────────────
    static async show(req, res) {
        try {
            const { id } = req.params;
            const contest = await prisma_1.default.contest.findUnique({
                where: { id },
                include: {
                    Problems: { orderBy: { order_index: "asc" } },
                    Participants: { orderBy: { total_points: "desc" } },
                },
            });
            if (!contest)
                return res.status(404).json({ success: false, message: "Contest not found" });
            return res.json({ success: true, contest });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
    // ── Create contest ───────────────────────────────────────────────────────────
    static async store(req, res) {
        try {
            const { title, description, creator_id, creator_username, start_time, end_time, problems } = req.body;
            if (!title || !creator_id || !start_time || !end_time) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }
            const contest = await prisma_1.default.contest.create({
                data: {
                    title,
                    description: description ?? "",
                    creator_id,
                    creator_username,
                    start_time: new Date(start_time),
                    end_time: new Date(end_time),
                    Problems: {
                        create: (problems ?? []).map((p, i) => ({
                            title: p.title,
                            description: p.description,
                            constraints: p.constraints ?? "",
                            examples: p.examples ?? "",
                            difficulty: p.difficulty ?? "medium",
                            points: p.points ?? 100,
                            order_index: i,
                        })),
                    },
                },
                include: { Problems: true },
            });
            return res.status(201).json({ success: true, message: "Contest created!", contest });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
    // ── Join contest ─────────────────────────────────────────────────────────────
    static async join(req, res) {
        try {
            const { contest_id, user_id, username } = req.body;
            const existing = await prisma_1.default.contestParticipant.findUnique({
                where: { contest_id_user_id: { contest_id, user_id } },
            });
            if (existing)
                return res.json({ success: true, message: "Already joined", participant: existing });
            const participant = await prisma_1.default.contestParticipant.create({
                data: { contest_id, user_id, username },
            });
            return res.status(201).json({ success: true, message: "Joined contest!", participant });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
    // ── Submit solution ──────────────────────────────────────────────────────────
    static async submit(req, res) {
        try {
            const { contest_id, problem_id, user_id, username, language, code } = req.body;
            // Get problem details
            const problem = await prisma_1.default.contestProblem.findUnique({ where: { id: problem_id } });
            if (!problem)
                return res.status(404).json({ success: false, message: "Problem not found" });
            // Check contest is still active
            const contest = await prisma_1.default.contest.findUnique({ where: { id: contest_id } });
            if (!contest)
                return res.status(404).json({ success: false, message: "Contest not found" });
            const now = new Date();
            if (now < contest.start_time)
                return res.status(400).json({ success: false, message: "Contest hasn't started yet" });
            if (now > contest.end_time)
                return res.status(400).json({ success: false, message: "Contest has ended" });
            // AI evaluation
            const prompt = `You are an expert competitive programming judge. Evaluate this ${language} code submission.

Problem Title: ${problem.title}
Problem Description: ${problem.description}
Constraints: ${problem.constraints}
Examples: ${problem.examples}

Submitted Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Evaluate and respond ONLY in this exact JSON format (no markdown, no extra text):
{
  "score": 85,
  "status": "accepted",
  "feedback": "Clear explanation of what works and what doesn't in 2-3 sentences",
  "time_complexity": "O(n log n)",
  "space_complexity": "O(n)",
  "correctness": "correct",
  "suggestions": "One improvement tip"
}

score: 0-100. status: "accepted" | "partial" | "wrong_answer" | "error".
correctness: "correct" | "partial" | "incorrect".
Be strict but fair. If code looks syntactically wrong give score 0.`;
            let aiResult = { score: 0, status: "error", feedback: "AI evaluation failed", time_complexity: "Unknown", space_complexity: "Unknown", correctness: "incorrect", suggestions: "" };
            try {
                const result = await model.generateContent(prompt);
                const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
                aiResult = JSON.parse(text);
            }
            catch {
                // Keep default aiResult on parse failure
            }
            const maxPoints = problem.points;
            const earnedPoints = Math.round((aiResult.score / 100) * maxPoints);
            // Save submission
            const submission = await prisma_1.default.contestSubmission.create({
                data: {
                    contest_id,
                    problem_id,
                    user_id,
                    username,
                    language,
                    code,
                    score: earnedPoints,
                    status: aiResult.status,
                    feedback: aiResult.feedback + (aiResult.suggestions ? `\n\n💡 ${aiResult.suggestions}` : ""),
                    time_complexity: aiResult.time_complexity,
                },
            });
            // Update participant total_points (only count best score per problem)
            const allSubmissions = await prisma_1.default.contestSubmission.findMany({
                where: { contest_id, user_id },
            });
            // Best score per problem
            const bestPerProblem = new Map();
            allSubmissions.forEach((s) => {
                const prev = bestPerProblem.get(s.problem_id) ?? 0;
                if (s.score > prev)
                    bestPerProblem.set(s.problem_id, s.score);
            });
            const totalPoints = Array.from(bestPerProblem.values()).reduce((a, b) => a + b, 0);
            await prisma_1.default.contestParticipant.upsert({
                where: { contest_id_user_id: { contest_id, user_id } },
                update: { total_points: totalPoints },
                create: { contest_id, user_id, username, total_points: totalPoints },
            });
            return res.json({
                success: true,
                submission,
                evaluation: aiResult,
                earned_points: earnedPoints,
                total_points: totalPoints,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Something went wrong during evaluation" });
        }
    }
    // ── Get user's submissions for a contest ─────────────────────────────────────
    static async userSubmissions(req, res) {
        try {
            const { contest_id, user_id } = req.query;
            const submissions = await prisma_1.default.contestSubmission.findMany({
                where: { contest_id: contest_id, user_id: user_id },
                orderBy: { submitted_at: "desc" },
            });
            return res.json({ success: true, submissions });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
}
exports.default = ContestController;
