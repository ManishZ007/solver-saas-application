"use client";

import { CalendarDaysIcon } from "lucide-react";
import React, { useState } from "react";
import CreateEventDialog from "./dialogs/CreateEventDialog";
import Image from "next/image";
import CreatePostDialog from "./dialogs/CreatePostDialog";

type CreatePostContainerProps = {
  user?: User;
};

const CreatePostContainer = ({ user }: CreatePostContainerProps) => {
  const [openEventDialog, setOpenEventDialog] = useState<boolean>(false);
  const [openCreatePostDialog, setOpenCreatePostDialog] =
    useState<boolean>(false);

  const handleOpenEventDialog = () => {
    setOpenEventDialog(!openEventDialog);
  };

  const handleOpenCreatePostDialog = () => {
    setOpenCreatePostDialog(!openCreatePostDialog);
  };

  return (
    <>
      <div className="flex flex-col gap-2 border border-solid boredr-[#222222]/10 rounded-3xl p-3">
        <div className="flex gap-2  items-center  ">
          <div className="w-12 h-12">
            {user?.profile_image?.length ? (
              <>
                <Image
                  src={user.profile_image}
                  alt="user profile"
                  width={100}
                  height={100}
                  className="h-auto w-full bg-cover rounded-full"
                />
              </>
            ) : (
              <>
                <p className="h-12 w-12 text-2xl rounded-full border flex items-center justify-center">
                  {user?.username?.charAt(0)}
                </p>
              </>
            )}
          </div>

          <div
            className="w-full p-3 border border-solid boredr-[#222222]/10 rounded-3xl cursor-pointer"
            onClick={() => handleOpenCreatePostDialog()}
          >
            <p className="text-muted-foreground">Start posting...</p>
          </div>
        </div>
        <div>
          <div
            className="flex gap-1 items-start justify-start p-2 cursor-pointer"
            onClick={() => handleOpenEventDialog()}
          >
            <CalendarDaysIcon className=" h-5 w-5" />
            <p className="text-muted-foreground">Set a Event</p>
          </div>
        </div>
      </div>
      <CreateEventDialog
        open={openEventDialog}
        handleOpenEventDialog={handleOpenEventDialog}
        user={user}
      />
      <CreatePostDialog
        open={openCreatePostDialog}
        handleOpenCreatePostDialog={handleOpenCreatePostDialog}
        user={user}
      />
    </>
  );
};

export default CreatePostContainer;
