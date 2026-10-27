"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CONTESTS_URL } from "@/lib/apiEndPoints";
import { useRouter } from "next/navigation";
import { Trophy, Clock, Users, Plus, Zap, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isPast, isFuture } from "date-fns";

function getStatus(contest: ContestType) {
  const now = new Date();
  if (isFuture(new Date(contest.start_time))) return "upcoming";
  if (isPast(new Date(contest.end_time))) return "ended";
  return "live";
}

const STATUS_STYLES = {
  live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200",
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200",
  ended: "bg-muted text-muted-foreground border-border",
};

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming" | "ended">("all");
  const router = useRouter();

  useEffect(() => {
    axios
      .get<{ success: boolean; contests: ContestType[] }>(CONTESTS_URL)
      .then((r) => { if (r.data.success) setContests(r.data.contests); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = contests.filter((c) => filter === "all" || getStatus(c) === filter);

  return (
    <div className="max-w-4xl mx-auto py-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" /> Coding Contests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Solve DSA problems, get AI-scored, climb the rankings
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/contests/create")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Contest
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "live", "upcoming", "ended"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {f === "live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 align-middle" />}
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No {filter !== "all" ? filter : ""} contests found</p>
          <p className="text-sm mt-1">Be the first to create one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((contest) => {
            const status = getStatus(contest);
            const problems = (contest as ContestType & { Problems?: { id: string }[] }).Problems?.length ?? 0;
            const participants = (contest as ContestType & { Participants?: { id: string }[] }).Participants?.length ?? 0;

            return (
              <div
                key={contest.id}
                onClick={() => router.push(`/dashboard/contests/${contest.id}`)}
                className="border rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[status]}`}>
                        {status === "live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 align-middle animate-pulse" />}
                        {status.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {contest.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {contest.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {problems} problem{problems !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {participants} participant{participants !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {status === "upcoming"
                      ? `Starts ${formatDistanceToNow(new Date(contest.start_time), { addSuffix: true })}`
                      : status === "live"
                      ? `Ends ${formatDistanceToNow(new Date(contest.end_time), { addSuffix: true })}`
                      : `Ended ${formatDistanceToNow(new Date(contest.end_time), { addSuffix: true })}`}
                  </span>
                  <span className="flex items-center gap-1">
                    {status === "ended" ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    by {contest.creator_username}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
