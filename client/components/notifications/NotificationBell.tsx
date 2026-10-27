"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { MARK_NOTIFICATIONS_READ, NOTIFICATIONS_URL } from "@/lib/apiEndPoints";
import { getSocket } from "@/lib/socket.config";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!session?.user?.id) return;

    axios
      .get<{ success: boolean; notifications: NotificationType[] }>(
        `${NOTIFICATIONS_URL}?user_id=${session.user.id}`
      )
      .then((res) => {
        if (res.data.success) setNotifications(res.data.notifications);
      })
      .catch(() => {});

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.on(`notification:${session.user.id}`, (n: NotificationType) => {
      setNotifications((prev) => [n, ...prev]);
    });

    return () => {
      socket.off(`notification:${session.user.id}`);
    };
  }, [session?.user?.id]);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unread > 0 && session?.user?.id) {
      await axios
        .post(MARK_NOTIFICATIONS_READ, { user_id: session.user.id })
        .catch(() => {});
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.post_id ? `/dashboard/profile/post/${n.post_id}` : "/dashboard"}
                className={`flex flex-col gap-1 px-4 py-3 hover:bg-muted transition-colors border-b last:border-0 ${
                  !n.is_read ? "bg-blue-500/5" : ""
                }`}
              >
                <p className="text-sm leading-snug">{n.message}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </span>
              </Link>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
