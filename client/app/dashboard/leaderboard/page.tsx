"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { LEADERBOARD_URL } from "@/lib/apiEndPoints";
import { Trophy, Medal, Star, Code2 } from "lucide-react";

type LeaderboardEntry = {
  rank: number;
  username: string;
  total_ratings: number;
  total_solutions: number;
};

const RANK_STYLES = [
  { bg: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700", icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
  { bg: "bg-gray-50 dark:bg-gray-800/20 border-gray-300 dark:border-gray-600", icon: <Medal className="w-5 h-5 text-gray-400" /> },
  { bg: "bg-orange-50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-700", icon: <Medal className="w-5 h-5 text-orange-400" /> },
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ success: boolean; leaderboard: LeaderboardEntry[] }>(LEADERBOARD_URL)
      .then((res) => {
        if (res.data.success) setLeaders(res.data.leaderboard);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-6 px-2">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top contributors ranked by community ratings</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No contributors yet. Be the first!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leaders.map((entry) => {
            const style = RANK_STYLES[entry.rank - 1];
            return (
              <div
                key={entry.username}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  style ? style.bg : "border-border"
                } transition-all hover:scale-[1.01]`}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {style ? (
                    style.icon
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center font-bold text-sm">
                  {entry.username.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-semibold">{entry.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.total_solutions} solution{entry.total_solutions !== 1 ? "s" : ""} posted
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {entry.total_ratings}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Code2 className="w-3 h-3" />
                    {entry.total_solutions}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
