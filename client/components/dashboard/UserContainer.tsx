"use client";

import { ArrowUpRight, Code2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserContainerProps = {
  user?: User;
};

const UserContainer = ({ user }: UserContainerProps) => {
  const router = useRouter();

  return (
    <div className="md:min-w-[240px] rounded-2xl border bg-card overflow-hidden">
      {/* Gradient header */}
      <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

      <div className="px-4 pb-4 -mt-8">
        {/* Avatar */}
        <div className="mb-3">
          {user?.profile_image?.length ? (
            <Image
              src={user.profile_image}
              alt="user profile"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full border-2 border-background object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-background bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {user?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-0.5 mb-3">
          <h2 className="font-semibold text-base leading-tight">{user?.username}</h2>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>

        <button
          onClick={() => router.push("/dashboard/profile")}
          className="w-full flex items-center justify-center gap-1.5 text-sm py-1.5 rounded-xl border hover:bg-muted transition-colors"
        >
          View profile <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer strip */}
      <div className="px-4 py-2 border-t bg-muted/40 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Code2 className="w-3.5 h-3.5" />
        Solver — Dev Q&A Platform
      </div>
    </div>
  );
};

export default UserContainer;
