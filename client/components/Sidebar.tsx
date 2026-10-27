"use client";

import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import React from "react";
import { User, MessageSquare, TerminalSquare, Trophy, Zap } from "lucide-react";
import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarItem {
  id: number;
  name: string;
  path: string;
  icon: ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: 1, name: "Profile",     path: "/dashboard/profile",     icon: <User className="h-5 w-5" /> },
  { id: 4, name: "Chats",       path: "/dashboard/chats",        icon: <MessageSquare className="h-5 w-5" /> },
  { id: 5, name: "Terminal",    path: "/dashboard/terminal",     icon: <TerminalSquare className="h-5 w-5" /> },
  { id: 6, name: "Leaderboard", path: "/dashboard/leaderboard",  icon: <Trophy className="h-5 w-5" /> },
  { id: 7, name: "Contests",    path: "/dashboard/contests",     icon: <Zap className="h-5 w-5" /> },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex sticky top-0 h-screen flex-col items-center py-4 px-2 border-r bg-card w-[60px] shrink-0">
      {/* Logo / home */}
      <button
        onClick={() => router.push("/dashboard")}
        title="Dashboard"
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors mb-1 ${
          pathname === "/dashboard"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutDashboardIcon className="h-5 w-5" />
      </button>

      <div className="w-6 h-px bg-border my-2" />

      {/* Nav items */}
      <ul className="flex flex-col gap-1 items-center flex-1">
        {sidebarItems.map(({ id, icon, path, name }) => {
          const isActive = pathname.startsWith(path);
          return (
            <li key={id}>
              <button
                title={name}
                onClick={() => router.push(path)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {icon}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Sign out */}
      <button
        title="Sign out"
        onClick={() => signOut({ callbackUrl: "/sign-in" })}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
      >
        <LogOutIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Sidebar;
