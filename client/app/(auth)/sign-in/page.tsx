"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { SEND_OTP_URL, VERIFY_OTP_URL } from "@/lib/apiEndPoints";
import { ArrowLeft, Mail, Loader2, ShieldCheck, Code2 } from "lucide-react";

type Step = "identifier" | "otp";

export default function SignIn() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1 — send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    try {
      const r = await axios.post<{ success: boolean; message: string; email: string }>(
        SEND_OTP_URL,
        { identifier }
      );
      if (r.data.success) {
        setMaskedEmail(r.data.email);
        setStep("otp");
        toast.success("Verification code sent!");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message ?? "Could not send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP then sign in
  const handleVerifyOtp = async (overrideOtp?: string[]) => {
    const code = (overrideOtp ?? otp).join("");
    if (code.length < 6) { toast.error("Enter the full 6-digit code."); return; }
    setLoading(true);
    try {
      const r = await axios.post<{ success: boolean; message: string }>(
        VERIFY_OTP_URL,
        { identifier, otp: code }
      );
      if (r.data.success) {
        // OTP verified — now sign in via NextAuth credentials
        const result = await signIn("credentials", {
          identifier,
          redirect: false,
        });
        if (result?.error) {
          toast.error("Sign in failed. Please try again.");
          return;
        }
        toast.success("Signed in!");
        router.push("/dashboard");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message ?? "Incorrect code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      setTimeout(() => handleVerifyOtp(newOtp), 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    try {
      await axios.post(SEND_OTP_URL, { identifier });
      toast.success("New code sent!");
    } catch {
      toast.error("Could not resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-primary/5 border-r px-10 py-12">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Solver</span>
        </div>
        <div className="space-y-6">
          <blockquote className="text-2xl font-semibold leading-snug">
            "The best way to get unstuck is to share the problem."
          </blockquote>
          <p className="text-muted-foreground text-sm">
            Post your coding problems, get community solutions, compete in AI-judged contests, and grow as a developer.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Solver. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] space-y-6">

          {step === "identifier" ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Sign in</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email or username to receive a verification code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email or username</Label>
                  <Input
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="rohadas or rohadas@gmail.com"
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading || !identifier.trim()}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send verification code"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("identifier"); setOtp(["", "", "", "", "", ""]); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Check your email</h1>
                </div>
                <p className="text-muted-foreground text-sm pt-1">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">{maskedEmail}</span>.
                  Enter it below to sign in.
                </p>
              </div>

              {/* OTP inputs */}
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                    className="w-12 h-14 text-center text-xl font-bold border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full h-11"
                disabled={loading || otp.join("").length < 6}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Sign in"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary font-medium hover:underline disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                <Mail className="w-4 h-4 shrink-0" />
                Code expires in 10 minutes. Check your spam folder if you don&apos;t see it.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
