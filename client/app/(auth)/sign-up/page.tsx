"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Code2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { SignUpSchema, TSignUpSchema } from "@/lib/validations/userSchema";
import useDebounce from "@/hooks/use-debounce";
import { useForm } from "react-hook-form";
import { CHECK_EMAIL_URL, CHECK_USERNAME_URL, CREATE_USER_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";

const FieldMsg = ({ msg, loading }: { msg: string | null; loading: boolean }) => {
  if (loading) return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
  if (!msg) return null;
  const ok = msg.includes("available");
  return (
    <span className={`flex items-center gap-1 text-xs ${ok ? "text-green-500" : "text-red-500"}`}>
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {msg}
    </span>
  );
};

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debounceUsername = useDebounce(username);
  const debounceEmail = useDebounce(email);

  const { register, handleSubmit, formState: { errors } } = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { firstname: "", lastname: "", username: "", email: "", password: "" },
  });

  useEffect(() => {
    if (!username) return;
    setIsCheckingUsername(true);
    setUsernameMessage(null);
    axios.post<ApiResponse>(CHECK_USERNAME_URL, { username: debounceUsername })
      .then((r) => setUsernameMessage(r.data.message!))
      .catch((e: AxiosError<ApiResponse>) => setUsernameMessage(e.response?.data.message ?? "Error"))
      .finally(() => setIsCheckingUsername(false));
  }, [debounceUsername]);

  useEffect(() => {
    if (!email) return;
    setIsCheckingEmail(true);
    setEmailMessage(null);
    axios.post<ApiResponse>(CHECK_EMAIL_URL, { email: debounceEmail })
      .then((r) => setEmailMessage(r.data.message!))
      .catch((e: AxiosError<ApiResponse>) => setEmailMessage(e.response?.data.message ?? "Error"))
      .finally(() => setIsCheckingEmail(false));
  }, [debounceEmail]);

  const onSubmit = async (data: TSignUpSchema) => {
    setSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>(CREATE_USER_URL, {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });
      if (res.data.success) {
        toast.success("Account created! Please sign in.");
        router.push("/sign-in");
      } else {
        toast.error(res.data.message ?? "Something went wrong.");
      }
    } catch {
      toast.error("Could not create account. Try again.");
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-semibold leading-snug">
            Join thousands of developers solving problems together.
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Post coding problems with screenshots",
              "Get AI + community solutions instantly",
              "Compete in LeetCode-style DSA contests",
              "Practice Linux commands in the browser",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Solver. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px] space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm">Fill in the details below to get started for free.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">First name</Label>
                <Input {...register("firstname")} placeholder="John" className="h-10" />
                {errors.firstname && <p className="text-xs text-red-500">{errors.firstname.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Last name</Label>
                <Input {...register("lastname")} placeholder="Doe" className="h-10" />
                {errors.lastname && <p className="text-xs text-red-500">{errors.lastname.message}</p>}
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-sm">Username</Label>
              <Input
                {...register("username")}
                placeholder="johndoe"
                className="h-10"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FieldMsg msg={usernameMessage} loading={isCheckingUsername} />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-sm">Email address</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="h-10"
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldMsg msg={emailMessage} loading={isCheckingEmail} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-sm">Password</Label>
              <Input {...register("password")} type="password" placeholder="Min. 8 characters" className="h-10" />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
