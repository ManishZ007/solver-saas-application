"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { clearCache } from "@/actions/comman";
import { FetchChatGroups } from "@/types/ApiResponse";
import { DELETE_CHAT_GROUP_URL } from "@/lib/apiEndPoints";

type DeleteChatGroupProps = {
  open: boolean;
  group: FetchChatGroups;
  handleDeleteGroup: () => void;
};

export function DeleteChatGroup({
  open,
  group,
  handleDeleteGroup,
}: DeleteChatGroupProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteValue, setDeleteValue] = useState<string>("");
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setDeleteMessage("");

      if (group.title === deleteValue) {
        const { data } = await axios.delete(
          `${DELETE_CHAT_GROUP_URL}/${group.id}`
        );

        if (data?.message) {
          toast.success(data?.message);
          handleDeleteGroup();
          clearCache("chats");
        }
        setLoading(false);
      } else {
        setDeleteMessage("please enter the name of group");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("somthing went wrong please try again letter");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDeleteGroup}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            Are you absolutely sure you want to delete the group?
          </DialogTitle>
          <DialogDescription>
            Deleting the group{" "}
            <span className="font-bold">{` ${group.title}`}</span> will
            permanently remove all data, including files and messages. Please
            type the group name to confirm. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start w-full gap-2">
            <Input
              type="text"
              value={deleteValue!}
              onChange={(e) => setDeleteValue(e.target.value)}
            />
            {deleteMessage && (
              <p className="text-sm text-red-400">{deleteMessage}</p>
            )}
          </div>
        </div>

        <Button className="mt-3" disabled={loading} onClick={() => onSubmit()}>
          {loading ? "Deleting" : "Delete"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
