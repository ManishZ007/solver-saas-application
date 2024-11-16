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
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  TEditChatGroupSchema,
  EditChatGroupSchema,
} from "@/lib/validations/chatGroupSchema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clearCache } from "@/actions/comman";
import { FetchChatGroups } from "@/types/ApiResponse";
import { EDIT_CHAT_GROUP_URL } from "@/lib/apiEndPoints";

type EditChatGroupProps = {
  open: boolean;
  group: FetchChatGroups;
  handleEditGroup: () => void;
};

export function EditChatGroup({
  open,
  group,
  handleEditGroup,
}: EditChatGroupProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, setValue } = useForm<TEditChatGroupSchema>({
    resolver: zodResolver(EditChatGroupSchema),
    defaultValues: {
      title: "",
      password: "",
    },
  });

  useEffect(() => {
    setValue("title", group.title as string);
    setValue("password", group.password as string);
  }, [group]);

  const onSubmit = async (payload: TEditChatGroupSchema) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${EDIT_CHAT_GROUP_URL}/${group.id}`,
        payload
      );

      if (data?.message) {
        toast.success(data?.message);
        handleEditGroup();
        clearCache("chats");
      }
      setLoading(false);
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
    <Dialog open={open} onOpenChange={handleEditGroup}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-start w-full gap-2">
              <Label className="text-[13px]">Email</Label>
              <Input {...register("title")} type="text" />
            </div>
            <div className="flex flex-col items-start w-full gap-2">
              <Label className="text-[13px]">Username</Label>
              <Input {...register("password")} type="text" />
            </div>
          </div>

          <Button type="submit" className="mt-3">
            {loading ? "Changing..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
