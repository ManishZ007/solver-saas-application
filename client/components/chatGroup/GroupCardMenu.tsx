"use client";

import React, { Suspense, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { FetchChatGroups } from "@/types/ApiResponse";
import { APP_CHAT_GROUP_URL } from "@/lib/apiEndPoints";
import { EditChatGroup } from "./EditCharGroup";
import { DeleteChatGroup } from "./DeletechatGroup";

type GroupCardMenuProps = {
  group: FetchChatGroups;
};

const GroupCardMenu = ({ group }: GroupCardMenuProps) => {
  const [editGroup, setEditGroup] = useState<boolean>(false);
  const [deleteGroup, setDeleteGroup] = useState<boolean>(false);

  const handleOpenDeleteGroup = () => {
    setDeleteGroup(!deleteGroup);
  };

  const handleOpenEditGroup = () => {
    setEditGroup(!editGroup);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(APP_CHAT_GROUP_URL + `/${group.id}`);
    toast.success("link copied successfully!");
  };

  return (
    <>
      {editGroup && (
        <Suspense fallback={<p>...Loading</p>}>
          <EditChatGroup
            open={editGroup}
            group={group}
            handleEditGroup={handleOpenEditGroup}
          />
        </Suspense>
      )}
      {deleteGroup && (
        <Suspense fallback={<p>Loading...</p>}>
          <DeleteChatGroup
            open={deleteGroup}
            group={group}
            handleDeleteGroup={handleOpenDeleteGroup}
          />
        </Suspense>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={`ghost`} size={`icon`}>
            <EllipsisVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleCopy}>Copy link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditGroup(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteGroup(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GroupCardMenu;
