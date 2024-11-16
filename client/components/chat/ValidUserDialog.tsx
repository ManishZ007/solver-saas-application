import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  TValidUserSchema,
  ValidUserSchema,
} from "@/lib/validations/chatGroupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { STORE_CHAT_GROUP_USER } from "@/lib/apiEndPoints";
import { FetchChatGroups } from "@/types/ApiResponse";
import { useParams } from "next/navigation";
// import { clearCache } from "@/actions/comman";

type ValidUserDialogProps = {
  handleValidUser: () => void;
  open: boolean;
  group: FetchChatGroups;
};

const ValidUserDialog = ({
  handleValidUser,
  open,
  group,
}: ValidUserDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<TValidUserSchema>({
    resolver: zodResolver(ValidUserSchema),
  });

  const params = useParams();

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.username && jsonData?.group_id) {
        handleValidUser();
      }
    }
  });

  const onSubmit = async (payload: TValidUserSchema) => {
    setLoading(true);
    const localData = localStorage.getItem(params["id"] as string);
    if (!localData) {
      try {
        const res = await axios.post(STORE_CHAT_GROUP_USER, {
          username: payload.username,
          group_id: params["id"] as string,
        });

        console.log(res);
        localStorage.setItem(
          params["id"] as string,
          JSON.stringify(res?.data?.user)
        );
        // clearCache("chat-group-user");
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message);
        } else {
          console.log(error);
        }
      }
    }
    if (group.password !== payload.password) {
      toast.error("please enter correct password");
    } else {
      handleValidUser();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleValidUser}>
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
              <Label className="text-[13px]">Username</Label>
              <Input {...register("username")} type="text" />
            </div>
            <div className="flex flex-col items-start w-full gap-2">
              <Label className="text-[13px]">Password</Label>
              <Input {...register("password")} type="text" />
            </div>
          </div>

          <Button type="submit" className="mt-3">
            {loading ? "Connecting..." : "Connect"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ValidUserDialog;
