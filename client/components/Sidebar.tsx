"use client";

import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import React from "react";
import { User, MessageSquare } from "lucide-react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
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
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="hidden md:block sticky top-0 left-0    h-full py-4 px-5">
      <div className="relative h-full">
        <div className="relative flex flex-col items-start py-3 px-5 text-[15px]">
          <div
            className="flex gap-3 items-center cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboardIcon className="h-5 w-5" />
          </div>

          <ul className="flex flex-col gap-7 items-start mt-5">
            {sidebarItems.map(({ id, icon, path }) => (
              <div
                className="flex gap-3 items-center cursor-pointer"
                key={id}
                onClick={() => router.push(path)}
              >
                {icon}
              </div>
            ))}
          </ul>
          <div
            className="absolute top-[550px] flex gap-3 items-center cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOutIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
