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
    <div className="md:min-w-[240px] rounded-2xl border bg-card p-4 flex flex-col items-center text-center gap-3">
      {/* Avatar */}
      {user?.profile_image?.length ? (
        <Image
          src={user.profile_image}
          alt="user profile"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">
            {user?.username?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Name & email */}
      <div className="space-y-0.5">
        <h2 className="font-semibold text-base">{user?.username}</h2>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
      </div>

      {/* View profile */}
      <button
        onClick={() => router.push("/dashboard/profile")}
        className="w-full flex items-center justify-center gap-1.5 text-sm py-2 rounded-xl border hover:bg-muted transition-colors"
      >
        View profile <ArrowUpRight className="w-3.5 h-3.5" />
      </button>

      {/* Footer */}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Code2 className="w-3.5 h-3.5" /> Solver — Dev Q&A Platform
      </p>
    </div>
  );
};

export default UserContainer;
