"use client";

import { useState } from "react";
import axios from "axios";
import { CONTEST_URL } from "@/lib/apiEndPoints";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProblemDraft {
  title: string;
  description: string;
  constraints: string;
  examples: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

const emptyProblem = (): ProblemDraft => ({
  title: "",
  description: "",
  constraints: "",
  examples: "",
  difficulty: "medium",
  points: 100,
});

const DIFF_COLORS = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-red-100 text-red-700 border-red-300",
};

export default function CreateContestPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState<ProblemDraft[]>([emptyProblem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateProblem = (i: number, field: keyof ProblemDraft, value: string | number) => {
    setProblems((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const addProblem = () => setProblems((prev) => [...prev, emptyProblem()]);
  const removeProblem = (i: number) => setProblems((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (!title || !startTime || !endTime) { setError("Title, start time and end time are required"); return; }
    if (new Date(endTime) <= new Date(startTime)) { setError("End time must be after start time"); return; }
    if (problems.some((p) => !p.title || !p.description)) { setError("Every problem needs a title and description"); return; }

    setLoading(true);
    setError("");
    try {
      const user = session.user as User;
      await axios.post(CONTEST_URL, {
        title,
        description,
        creator_id: user.id,
        creator_username: user.username,
        start_time: startTime,
        end_time: endTime,
        problems,
      });
      router.push("/dashboard/contests");
    } catch {
      setError("Failed to create contest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-2">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground text-sm">
          Contests
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Create Contest</span>
      </div>

      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" /> New Contest
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contest details */}
        <section className="border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-base">Contest Details</h2>

          <div>
            <label className="text-sm font-medium mb-1 block">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DSA Showdown #1"
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this contest about?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Start Time *</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">End Time *</label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base">Problems ({problems.length})</h2>
            <Button type="button" variant="outline" size="sm" onClick={addProblem} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Problem
            </Button>
          </div>

          {problems.map((prob, i) => (
            <div key={i} className="border rounded-2xl p-5 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Problem {i + 1}</span>
                {problems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProblem(i)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={prob.title}
                  onChange={(e) => updateProblem(i, "title", e.target.value)}
                  placeholder="e.g. Two Sum"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <Textarea
                  value={prob.description}
                  onChange={(e) => updateProblem(i, "description", e.target.value)}
                  placeholder="Describe the problem clearly..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Constraints</label>
                <Textarea
                  value={prob.constraints}
                  onChange={(e) => updateProblem(i, "constraints", e.target.value)}
                  placeholder="e.g. 1 ≤ n ≤ 10^5, -10^9 ≤ nums[i] ≤ 10^9"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Examples</label>
                <Textarea
                  value={prob.examples}
                  onChange={(e) => updateProblem(i, "examples", e.target.value)}
                  placeholder={"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Difficulty</label>
                  <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => updateProblem(i, "difficulty", d)}
                        className={`px-3 py-1 text-xs rounded-full border capitalize transition-all ${
                          prob.difficulty === d
                            ? DIFF_COLORS[d]
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 max-w-[120px]">
                  <label className="text-sm font-medium mb-1 block">Points</label>
                  <Input
                    type="number"
                    min={10}
                    max={1000}
                    step={10}
                    value={prob.points}
                    onChange={(e) => updateProblem(i, "points", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Contest"}
          </Button>
        </div>
      </form>
    </div>
  );
}
