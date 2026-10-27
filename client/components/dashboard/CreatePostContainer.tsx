"use client";

import { CalendarDaysIcon, ImageIcon, Pencil } from "lucide-react";
import React, { useState } from "react";
import CreateEventDialog from "./dialogs/CreateEventDialog";
import Image from "next/image";
import CreatePostDialog from "./dialogs/CreatePostDialog";

type CreatePostContainerProps = {
  user?: User;
};

const CreatePostContainer = ({ user }: CreatePostContainerProps) => {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false);

  return (
    <>
      <div className="rounded-2xl border bg-card p-4 flex flex-col gap-3">
        {/* Post input row */}
        <div className="flex items-center gap-3">
          {user?.profile_image?.length ? (
            <Image
              src={user.profile_image}
              alt="user profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 border flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {user?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}

          <button
            onClick={() => setOpenCreatePostDialog(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-xl border bg-muted/40 text-muted-foreground text-sm hover:bg-muted transition-colors"
          >
            Share a coding problem or question...
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 pl-1 border-t pt-2">
          <button
            onClick={() => setOpenCreatePostDialog(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-1.5 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-blue-500" /> Add Image
          </button>
          <button
            onClick={() => setOpenCreatePostDialog(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-1.5 transition-colors"
          >
            <Pencil className="w-4 h-4 text-green-500" /> Post Problem
          </button>
          <button
            onClick={() => setOpenEventDialog(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-1.5 transition-colors ml-auto"
          >
            <CalendarDaysIcon className="w-4 h-4 text-orange-500" /> Set Event
          </button>
        </div>
      </div>

      <CreateEventDialog
        open={openEventDialog}
        handleOpenEventDialog={() => setOpenEventDialog(false)}
        user={user}
      />
      <CreatePostDialog
        open={openCreatePostDialog}
        handleOpenCreatePostDialog={() => setOpenCreatePostDialog(false)}
        user={user}
      />
    </>
  );
};

export default CreatePostContainer;
