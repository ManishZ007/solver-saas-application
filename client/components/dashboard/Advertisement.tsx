"use client";

import { useRouter } from "next/navigation";
import { Zap, Trophy, TerminalSquare, MessageSquare, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
    title: "Group Chats",
    desc: "Collaborate with devs in real-time",
    path: "/dashboard/chats",
  },
  {
    icon: <TerminalSquare className="w-4 h-4 text-green-500" />,
    title: "Linux Terminal",
    desc: "Learn shell commands in browser",
    path: "/dashboard/terminal",
  },
  {
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    title: "Coding Contests",
    desc: "AI-judged DSA competitions",
    path: "/dashboard/contests",
  },
  {
    icon: <Trophy className="w-4 h-4 text-amber-500" />,
    title: "Leaderboard",
    desc: "Top contributors by ratings",
    path: "/dashboard/leaderboard",
  },
];

const Advertisement = () => {
  const router = useRouter();

  return (
    <div className="hidden xl:flex flex-col gap-3 w-full md:max-w-[280px] shrink-0">
      {/* Platform features card */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-transparent">
          <p className="font-semibold text-sm">Explore Solver</p>
          <p className="text-xs text-muted-foreground mt-0.5">Everything on the platform</p>
        </div>
        <div className="divide-y">
          {features.map((f) => (
            <button
              key={f.title}
              onClick={() => router.push(f.path)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Tips card */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/0 p-4">
        <p className="text-sm font-semibold mb-1">💡 Pro tip</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use <code className="bg-muted px-1 rounded text-foreground">/ai your question</code> in any group chat to get an instant AI answer without leaving the conversation.
        </p>
      </div>
    </div>
  );
};

export default Advertisement;
