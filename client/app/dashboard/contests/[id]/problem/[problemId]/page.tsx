"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CONTEST_URL, CONTEST_SUBMIT_URL, CONTEST_SUBMISSIONS_URL, AI_HINT_URL } from "@/lib/apiEndPoints";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronRight, Send, CheckCircle, XCircle, AlertCircle, History, Lightbulb, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { formatDistanceToNow } from "date-fns";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

const STARTERS: Record<string, string> = {
  javascript: "// Write your solution here\nfunction solve(input) {\n  \n}\n",
  typescript: "// Write your solution here\nfunction solve(input: string): string {\n  \n}\n",
  python: "# Write your solution here\ndef solve(input):\n    pass\n",
  java: "// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n",
  cpp: "// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n",
  c: "// Write your solution here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}\n",
  go: "// Write your solution here\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello\")\n}\n",
  rust: "// Write your solution here\nfn main() {\n    \n}\n",
};

const STATUS_ICON = {
  accepted: <CheckCircle className="w-4 h-4 text-green-500" />,
  partial: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  wrong_answer: <XCircle className="w-4 h-4 text-red-500" />,
  error: <XCircle className="w-4 h-4 text-red-400" />,
};

export default function ProblemPage() {
  const { id: contestId, problemId } = useParams<{ id: string; problemId: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as User | undefined;

  const [contest, setContest] = useState<ContestType | null>(null);
  const [problem, setProblem] = useState<ContestProblemType | null>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTERS["javascript"]);
  const [submitting, setSubmitting] = useState(false);
  const [hinting, setHinting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [result, setResult] = useState<null | {
    score: number; status: string; feedback: string;
    time_complexity: string; earned_points: number; total_points: number;
  }>(null);
  const [submissions, setSubmissions] = useState<ContestSubmissionType[]>([]);
  const [tab, setTab] = useState<"problem" | "submissions">("problem");

  useEffect(() => {
    axios
      .get<{ success: boolean; contest: ContestType }>(`${CONTEST_URL}/${contestId}`)
      .then((r) => {
        if (r.data.success) {
          setContest(r.data.contest);
          const p = r.data.contest.Problems?.find((x) => x.id === problemId);
          if (p) setProblem(p);
        }
      })
      .catch(() => {});
  }, [contestId, problemId]);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get<{ success: boolean; submissions: ContestSubmissionType[] }>(CONTEST_SUBMISSIONS_URL, {
        params: { contest_id: contestId, user_id: user.id },
      })
      .then((r) => {
        if (r.data.success)
          setSubmissions(r.data.submissions.filter((s) => s.problem_id === problemId));
      })
      .catch(() => {});
  }, [contestId, problemId, user?.id, result]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;
    const tick = () => {
      const now = new Date();
      const end = new Date(contest.end_time);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h > 0 ? `${h}h ` : ""}${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [contest]);

  const handleHint = async () => {
    if (!problem) return;
    setHinting(true);
    setHint(null);
    try {
      const r = await axios.post<{ success: boolean; hint: string }>(AI_HINT_URL, {
        title: problem.title,
        description: problem.description,
        constraints: problem.constraints,
        language,
      });
      if (r.data.success) setHint(r.data.hint);
    } catch {
      setHint("Could not get a hint right now. Try again.");
    } finally {
      setHinting(false);
    }
  };

  const handleLangChange = (lang: string) => {
    setLanguage(lang);
    setCode(STARTERS[lang] ?? "");
  };

  const handleSubmit = async () => {
    if (!user || !problem || !contest) return;
    setSubmitting(true);
    setResult(null);
    try {
      const r = await axios.post<{
        success: boolean;
        evaluation: { score: number; status: string; feedback: string; time_complexity: string };
        earned_points: number;
        total_points: number;
      }>(CONTEST_SUBMIT_URL, {
        contest_id: contestId,
        problem_id: problemId,
        user_id: user.id,
        username: user.username,
        language,
        code,
      });
      if (r.data.success) {
        setResult({
          score: r.data.evaluation.score,
          status: r.data.evaluation.status,
          feedback: r.data.evaluation.feedback,
          time_complexity: r.data.evaluation.time_complexity,
          earned_points: r.data.earned_points,
          total_points: r.data.total_points,
        });
        setTab("submissions");
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem || !contest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b text-sm text-muted-foreground shrink-0">
        <button onClick={() => router.push("/dashboard/contests")} className="hover:text-foreground">
          Contests
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => router.push(`/dashboard/contests/${contestId}`)} className="hover:text-foreground truncate max-w-[150px]">
          {contest.title}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate max-w-[150px]">{problem.title}</span>
        {timeLeft && timeLeft !== "Ended" && (
          <span className={`ml-auto flex items-center gap-1 font-mono font-semibold text-sm px-2 py-0.5 rounded-lg ${
            timeLeft.startsWith("0m") || (timeLeft.includes("m") && parseInt(timeLeft) <= 5)
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-muted text-foreground"
          }`}>
            <Clock className="w-3.5 h-3.5" /> {timeLeft}
          </span>
        )}
        {timeLeft === "Ended" && (
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">Contest Ended</span>
        )}
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: problem statement */}
        <div className="w-[42%] border-r overflow-y-auto p-5 space-y-4 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">{problem.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
              problem.difficulty === "easy" ? "bg-green-100 text-green-700" :
              problem.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>{problem.difficulty}</span>
            <span className="text-xs font-bold text-muted-foreground ml-auto">{problem.points} pts</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{problem.description}</p>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Constraints</h3>
              <pre className="text-xs bg-muted rounded-lg p-3 whitespace-pre-wrap font-mono">{problem.constraints}</pre>
            </div>
          )}

          {problem.examples && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Examples</h3>
              <pre className="text-xs bg-muted rounded-lg p-3 whitespace-pre-wrap font-mono">{problem.examples}</pre>
            </div>
          )}

          {/* AI Hint */}
          <div className="border-t pt-3">
            <button
              onClick={handleHint}
              disabled={hinting}
              className="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              {hinting ? "Getting hint..." : "Get AI Hint"}
            </button>
            {hint && (
              <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-sm text-yellow-900 dark:text-yellow-200">
                <p className="font-medium mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> Hint
                </p>
                <p className="text-xs leading-relaxed">{hint}</p>
              </div>
            )}
          </div>

          {/* Tabs: Problem / Submissions */}
          <div className="border-t pt-4">
            <div className="flex gap-1 mb-3">
              {(["problem", "submissions"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg capitalize flex items-center gap-1 ${
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t === "submissions" && <History className="w-3.5 h-3.5" />}
                  {t} {t === "submissions" && submissions.length > 0 && `(${submissions.length})`}
                </button>
              ))}
            </div>

            {tab === "submissions" && (
              <div className="space-y-2">
                {result && (
                  <div className={`rounded-xl p-4 border ${
                    result.status === "accepted" ? "border-green-300 bg-green-50 dark:bg-green-900/20" :
                    result.status === "partial" ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20" :
                    "border-red-300 bg-red-50 dark:bg-red-900/20"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {STATUS_ICON[result.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.error}
                      <span className="font-semibold capitalize">{result.status.replace("_", " ")}</span>
                      <span className="ml-auto font-bold text-sm">{result.score}/100 · +{result.earned_points}pts</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{result.feedback}</p>
                    <p className="text-xs text-muted-foreground mt-1">Time complexity: {result.time_complexity}</p>
                    <p className="text-xs font-medium mt-1">Your total: {result.total_points} pts</p>
                  </div>
                )}
                {submissions.map((s) => (
                  <div key={s.id} className="border rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      {STATUS_ICON[s.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.error}
                      <span className="capitalize font-medium">{s.status.replace("_", " ")}</span>
                      <span className="ml-auto font-bold">{s.score}pts</span>
                    </div>
                    <p className="text-muted-foreground">{s.language} · {formatDistanceToNow(new Date(s.submitted_at), { addSuffix: true })}</p>
                  </div>
                ))}
                {submissions.length === 0 && !result && (
                  <p className="text-xs text-muted-foreground">No submissions yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b shrink-0 bg-muted/30">
            <select
              value={language}
              onChange={(e) => handleLangChange(e.target.value)}
              className="text-sm bg-background border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitting || !user}
              className="flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit
                </>
              )}
            </Button>
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                lineNumbers: "on",
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
