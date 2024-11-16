"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createGroupSchema,
  TCreateGroupSchema,
} from "@/lib/validations/chatGroupSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CREATE_CHAT_GROUP_URL } from "@/lib/apiEndPoints";
import { clearCache } from "@/actions/comman";

export function CreateChatGroup({ user_id }: { user_id: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const hanldeOpenDialog = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      title: "",
      password: "",
    },
  });

  const onSubmit = async (payload: TCreateGroupSchema) => {
    try {
      setLoading(true);
      const { data } = await axios.post(CREATE_CHAT_GROUP_URL, {
        ...payload,
        user_id: user_id,
      });

      if (data.success) {
        setLoading(false);
        setOpen(false);
        clearCache("chats");
        toast.success(data?.message);
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
    <Dialog open={open} onOpenChange={hanldeOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={hanldeOpenDialog}>
          Create group
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Start a New Conversation</DialogTitle>
          <DialogDescription>
            Create a new chat to collaborate with others. Add participants, name
            your conversation, and begin sharing ideas or solving problems
            together in real-time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Title</Label>
              <Input {...register("title")} type="text" />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors?.title?.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Password</Label>
              <Input {...register("password")} type="text" />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors?.password?.message}
                </p>
              )}
            </div>
          </div>
          <Button className="mt-3" disabled={loading} type="submit">
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
