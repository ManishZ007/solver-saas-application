"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CONTEST_URL, CONTEST_JOIN_URL } from "@/lib/apiEndPoints";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trophy, Clock, Users, ChevronRight, Medal, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isPast, isFuture, format } from "date-fns";

const DIFF_COLORS = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs font-bold text-muted-foreground w-4 text-center">{rank}</span>;
}

export default function ContestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [contest, setContest] = useState<ContestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const user = session?.user as User | undefined;

  useEffect(() => {
    axios
      .get<{ success: boolean; contest: ContestType }>(`${CONTEST_URL}/${id}`)
      .then((r) => {
        if (r.data.success) {
          setContest(r.data.contest);
          const isJoined = r.data.contest.Participants?.some((p) => p.user_id === user?.id);
          setJoined(!!isJoined);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleJoin = async () => {
    if (!user || !contest) return;
    setJoining(true);
    try {
      await axios.post(CONTEST_JOIN_URL, {
        contest_id: contest.id,
        user_id: user.id,
        username: user.username,
      });
      setJoined(true);
      setContest((prev) =>
        prev
          ? {
              ...prev,
              Participants: [
                ...(prev.Participants ?? []),
                { id: "new", contest_id: prev.id, user_id: user.id!, username: user.username ?? "", total_points: 0, joined_at: new Date().toISOString() },
              ],
            }
          : prev
      );
    } catch {
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-2 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded-2xl animate-pulse" />
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-2 text-center text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>Contest not found.</p>
      </div>
    );
  }

  const now = new Date();
  const isUpcoming = isFuture(new Date(contest.start_time));
  const isEnded = isPast(new Date(contest.end_time));
  const isLive = !isUpcoming && !isEnded;

  return (
    <div className="max-w-4xl mx-auto py-6 px-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <button onClick={() => router.push("/dashboard/contests")} className="hover:text-foreground">
          Contests
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{contest.title}</span>
      </div>

      {/* Contest Header */}
      <div className="border rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isLive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  LIVE
                </span>
              )}
              {isUpcoming && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-medium">
                  UPCOMING
                </span>
              )}
              {isEnded && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border font-medium">
                  ENDED
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{contest.title}</h1>
            {contest.description && (
              <p className="text-muted-foreground mt-1">{contest.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {isUpcoming
                  ? `Starts ${formatDistanceToNow(new Date(contest.start_time), { addSuffix: true })}`
                  : isLive
                  ? `Ends ${formatDistanceToNow(new Date(contest.end_time), { addSuffix: true })}`
                  : `Ended ${formatDistanceToNow(new Date(contest.end_time), { addSuffix: true })}`}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {contest.Participants?.length ?? 0} participants
              </span>
              <span>
                {format(new Date(contest.start_time), "MMM d, h:mm a")} –{" "}
                {format(new Date(contest.end_time), "MMM d, h:mm a")}
              </span>
            </div>
          </div>

          {user && (isLive || isUpcoming) && (
            <div>
              {joined ? (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" /> Registered
                </span>
              ) : (
                <Button onClick={handleJoin} disabled={joining}>
                  {joining ? "Joining..." : "Join Contest"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Problems list */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Problems
          </h2>
          {(contest.Problems ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No problems added yet.</p>
          ) : (
            (contest.Problems ?? []).map((prob, i) => (
              <div
                key={prob.id}
                onClick={() => {
                  if (!joined && isLive) { handleJoin(); return; }
                  router.push(`/dashboard/contests/${contest.id}/problem/${prob.id}`);
                }}
                className={`border rounded-xl p-4 flex items-center justify-between gap-3 transition-all ${
                  isLive ? "cursor-pointer hover:border-primary/40 hover:shadow-sm group" : "opacity-75"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{prob.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{prob.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${DIFF_COLORS[prob.difficulty]}`}>
                    {prob.difficulty}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{prob.points}pts</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="font-semibold text-base flex items-center gap-2 mb-3">
            <Medal className="w-4 h-4 text-yellow-500" /> Leaderboard
          </h2>
          {(contest.Participants ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No participants yet.</p>
          ) : (
            <div className="space-y-2">
              {[...(contest.Participants ?? [])]
                .sort((a, b) => b.total_points - a.total_points)
                .slice(0, 10)
                .map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                      i === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" :
                      i === 1 ? "bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700" :
                      i === 2 ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" :
                      "border border-border"
                    }`}
                  >
                    <RankIcon rank={i + 1} />
                    <span className="flex-1 text-sm font-medium truncate">{p.username}</span>
                    <span className="text-sm font-bold">{p.total_points}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
