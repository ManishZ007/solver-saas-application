"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma_1 = __importDefault(require("../config/prisma"));
// In-memory OTP store: email → { otp, expiresAt }
const otpStore = new Map();
// Use real Gmail if credentials are set, otherwise Ethereal (dev preview)
async function getTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
        !process.env.EMAIL_USER.includes("your_gmail")) {
        return nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
    }
    // Ethereal: free fake SMTP — prints preview URL in server console
    const testAccount = await nodemailer_1.default.createTestAccount();
    const t = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log("\n📧 Ethereal test account:", testAccount.user);
    return t;
}
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
class OtpController {
    // Step 1: verify credentials exist, then send OTP
    static async sendOtp(req, res) {
        try {
            const { identifier } = req.body;
            if (!identifier) {
                return res.status(400).json({ success: false, message: "identifier required" });
            }
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: { contains: identifier } },
                        { username: { contains: identifier } },
                    ],
                },
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "No account found with that email or username." });
            }
            const otp = generateOtp();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
            otpStore.set(user.email, { otp, expiresAt });
            // Always log OTP to console so dev can test without email setup
            console.log(`\n🔑 OTP for ${user.email}: ${otp}\n`);
            let previewUrl = false;
            try {
                const transporter = await getTransporter();
                const info = await transporter.sendMail({
                    from: `"Solver" <${process.env.EMAIL_USER ?? "solver@example.com"}>`,
                    to: user.email,
                    subject: "Your Solver verification code",
                    html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
              <h2 style="margin:0 0 8px;font-size:22px">Your verification code</h2>
              <p style="color:#6b7280;margin:0 0 24px">Use this code to sign in to Solver. It expires in <strong>10 minutes</strong>.</p>
              <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;background:#f3f4f6;padding:20px;border-radius:8px">
                ${otp}
              </div>
              <p style="color:#9ca3af;font-size:13px;margin:24px 0 0">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
                });
                previewUrl = nodemailer_1.default.getTestMessageUrl(info) || false;
                if (previewUrl)
                    console.log("📬 Email preview:", previewUrl);
            }
            catch (emailErr) {
                // Email failed but OTP is stored — dev can still use the console log above
                console.warn("⚠️  Email send failed (using console OTP):", emailErr.message);
            }
            return res.json({
                success: true,
                message: "OTP sent! Check your email or the server console.",
                email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
                ...(previewUrl ? { previewUrl } : {}),
            });
        }
        catch (err) {
            console.error("sendOtp error:", err);
            return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
        }
    }
    // Step 2: verify OTP then return user for NextAuth
    static async verifyOtp(req, res) {
        try {
            const { identifier, otp } = req.body;
            if (!identifier || !otp) {
                return res.status(400).json({ success: false, message: "identifier and otp required" });
            }
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: { contains: identifier } },
                        { username: { contains: identifier } },
                    ],
                },
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }
            const record = otpStore.get(user.email);
            if (!record) {
                return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
            }
            if (Date.now() > record.expiresAt) {
                otpStore.delete(user.email);
                return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
            }
            if (record.otp !== otp) {
                return res.status(400).json({ success: false, message: "Incorrect code. Try again." });
            }
            otpStore.delete(user.email);
            return res.json({ success: true, message: "OTP verified.", user });
        }
        catch {
            return res.status(500).json({ success: false, message: "Something went wrong." });
        }
    }
}
exports.default = OtpController;
