import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full relative">
      <Sidebar />

      <div className="p-4 mx-4 rounded-2xl  w-full">{children}</div>
    </div>
  );
}

//bg-[#f1f5f9] dark:bg-[#000000]
