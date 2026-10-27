"use client";

import {
  POST_IMAGE_ENDPOINT,
  RATING_TOGGLE,
  SOLUTION_HANDLING,
  AI_JUDGE_URL,
  MARK_SOLVED_URL,
} from "@/lib/apiEndPoints";
import {
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  SendHorizonal,
  CheckCircle2,
  Share2,
  Gavel,
  Trophy,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

type PostProps = {
  post?: PostType;
  user?: User;
};

type JudgeResult = {
  winner: { index: number; username: string; reason: string };
  rankings: Array<{
    index: number;
    username: string;
    score: number;
    correctness: string;
    performance: string;
    readability: string;
    feedback: string;
  }>;
  summary: string;
};

const TAG_COLORS: Record<string, string> = {
  React: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Next.js": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  TypeScript: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  JavaScript: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Python: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Node: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  CSS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Database: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Git: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? "bg-muted text-muted-foreground";
}

const Post = ({ post, user }: PostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsId, setSolutionsId] = useState<string[]>([]);
  const [ratingCounts, setRatingCounts] = useState<Record<string, number>>({});
  const [solution, setSolution] = useState("");
  const [isSolved, setIsSolved] = useState(post?.is_solved ?? false);
  const [acceptedId, setAcceptedId] = useState(post?.accepted_solution_id ?? null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [judging, setJudging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = user?.id === post?.user_id;

  useEffect(() => {
    const counts: Record<string, number> = {};
    const rated: string[] = [];
    post?.Solutions?.forEach((sol: SolutionType) => {
      counts[sol.id] = sol.Ratings?.length ?? 0;
      if (sol.Ratings?.some((r: RatingsType) => r.user_id === user?.id)) {
        rated.push(sol.id);
      }
    });
    setSolutionsId(rated);
    setRatingCounts(counts);
  }, [post?.Solutions, user?.id]);

  const handleGiveARating = async (sol?: SolutionType) => {
    if (!user?.id) return toast.error("You must be logged in to rate.");
    try {
      const res = await axios.post<{ success: boolean; rated: boolean; count: number }>(
        RATING_TOGGLE,
        { user_id: user.id, solution_id: sol?.id }
      );
      if (res.data.success) {
        const sid = sol?.id as string;
        setSolutionsId((prev) =>
          res.data.rated ? [...prev, sid] : prev.filter((id) => id !== sid)
        );
        setRatingCounts((prev) => ({ ...prev, [sid]: res.data.count }));
      }
    } catch (err) {
      if (err instanceof AxiosError) toast.error(err.response?.data?.message ?? err.message);
    }
  };

  const handleSubmitSolution = async () => {
    if (!solution.trim()) return toast.error("Solution cannot be empty");
    setSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>(SOLUTION_HANDLING, {
        post_id: post?.id,
        solution,
        username: user?.username,
      });
      if (!res.data.success) return toast.error(res.data.message);
      setSolution("");
      clearCache("all-post");
      toast.success(res.data.message);
    } catch (err) {
      if (err instanceof AxiosError) toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolved = async (solutionId: string) => {
    try {
      await axios.post(MARK_SOLVED_URL, { post_id: post?.id, solution_id: solutionId });
      setIsSolved(true);
      setAcceptedId(solutionId);
      toast.success("Post marked as solved!");
      clearCache("all-post");
    } catch {
      toast.error("Failed to mark as solved");
    }
  };

  const handleAiJudge = async () => {
    if ((post?.Solutions?.length ?? 0) < 2) {
      return toast.error("Need at least 2 solutions to judge");
    }
    setJudging(true);
    setJudgeResult(null);
    try {
      const res = await axios.post<{ success: boolean; result: JudgeResult }>(AI_JUDGE_URL, {
        problem: `${post?.title}. ${post?.description}`,
        solutions: post?.Solutions?.map((s) => ({ username: s.username, solution: s.solution })),
      });
      if (res.data.success) {
        setJudgeResult(res.data.result);
        setIsOpen(true);
      }
    } catch {
      toast.error("AI Judge failed. Try again.");
    } finally {
      setJudging(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/profile/post/${post?.id}`
    );
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 border rounded-2xl p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <p className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium bg-muted">
            {post?.username?.charAt(0)?.toUpperCase()}
          </p>
          <p className="text-sm font-medium">{post?.username}</p>
        </div>
        <div className="flex items-center gap-2">
          {isSolved && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
          )}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Share post"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tags */}
      {(post?.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post!.tags!.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title & description */}
      <h1 className="font-bold text-base">{post?.title}</h1>
      <Image
        src={`${POST_IMAGE_ENDPOINT}/${post?.post_image}`}
        alt="post"
        width={600}
        height={600}
        className="w-full h-auto rounded-lg"
      />
      <p className="text-sm text-muted-foreground tracking-tight">{post?.description}</p>

      {/* Solution input */}
      <div className="flex gap-2">
        <Input
          placeholder="Write your solution (supports markdown)..."
          className="flex-1"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
        <Button
          onClick={handleSubmitSolution}
          size="icon"
          disabled={submitting}
        >
          {submitting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <SendHorizonal className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Solutions section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-sm">
              {post?.Solutions?.length ?? 0} Answer{(post?.Solutions?.length ?? 0) !== 1 ? "s" : ""}
            </p>
            {(post?.Solutions?.length ?? 0) >= 2 && (
              <button
                onClick={handleAiJudge}
                disabled={judging}
                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                {judging ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Gavel className="w-3 h-3" />
                )}
                {judging ? "Judging..." : "AI Judge"}
              </button>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {/* AI Judge result */}
        {judgeResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-sm">
                Winner: {judgeResult.winner.username}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{judgeResult.winner.reason}</p>
            <div className="flex flex-col gap-1.5">
              {judgeResult.rankings.map((r) => (
                <div key={r.index} className="flex items-center gap-2 text-xs">
                  <span className="font-medium w-20 truncate">{r.username}</span>
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-8 text-right">{r.score}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">{judgeResult.summary}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-3"
            >
              {post?.Solutions?.map((sol, index) => {
                const isAccepted = sol.id === acceptedId;
                const judgeRank = judgeResult?.rankings?.find((r) => r.index === index + 1);
                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-3 flex flex-col gap-2 ${
                      isAccepted
                        ? "border-green-400 bg-green-50/50 dark:bg-green-900/10"
                        : "border-dashed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="w-6 h-6 rounded-full bg-muted border text-xs flex items-center justify-center font-medium">
                          {sol.username?.charAt(0)?.toUpperCase()}
                        </p>
                        <p className="text-sm font-medium">{sol.username}</p>
                        {isAccepted && (
                          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Accepted
                          </span>
                        )}
                      </div>
                      {isOwner && !isSolved && (
                        <button
                          onClick={() => handleMarkSolved(sol.id)}
                          className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Accept
                        </button>
                      )}
                    </div>

                    {/* Markdown rendered solution */}
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const isInline = !match;
                            return isInline ? (
                              <code className="bg-muted px-1 rounded text-xs" {...props}>
                                {children}
                              </code>
                            ) : (
                              <SyntaxHighlighter
                                style={oneDark as Record<string, React.CSSProperties>}
                                language={match[1]}
                                PreTag="div"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            );
                          },
                        }}
                      >
                        {sol.solution}
                      </ReactMarkdown>
                    </div>

                    {judgeRank && (
                      <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 px-2 py-1 rounded">
                        Score: {judgeRank.score} — {judgeRank.feedback}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleGiveARating(sol)}
                      >
                        <ThumbsUp
                          className="h-4 w-4"
                          style={{ fill: solutionsId.includes(sol.id) ? "currentColor" : "none" }}
                        />
                      </Button>
                      <p className="text-sm font-medium">{ratingCounts[sol.id] ?? 0}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Post;
