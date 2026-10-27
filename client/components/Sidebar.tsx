"use client";

import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import React from "react";
import { User, MessageSquare, TerminalSquare } from "lucide-react";
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
  {
    id: 1,
    name: "Profile",
    path: "/dashboard/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: 4,
    name: "Chats",
    path: "/dashboard/chats",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: 5,
    name: "Terminal",
    path: "/dashboard/terminal",
    icon: <TerminalSquare className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="hidden md:block sticky top-0 left-0 h-full py-4 px-3">
      <div className="relative h-full flex flex-col items-center">
        {/* Dashboard home */}
        <div
          className="flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => router.push("/dashboard")}
          title="Dashboard"
        >
          <LayoutDashboardIcon className="h-5 w-5" />
        </div>

        {/* Divider */}
        <div className="w-6 h-px bg-border my-3" />

        {/* Nav items */}
        <ul className="flex flex-col gap-2 items-center">
          {sidebarItems.map(({ id, icon, path, name }) => {
            const isActive = pathname.startsWith(path);
            return (
              <li key={id}>
                <div
                  title={name}
                  className={`flex gap-3 items-center cursor-pointer p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => router.push(path)}
                >
                  {icon}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Sign out — pinned to bottom */}
        <div
          className="mt-auto p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
          title="Sign out"
          onClick={() => signOut()}
        >
          <LogOutIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
