"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  CreatePostSchema,
  TCreatePostSchema,
} from "@/lib/validations/createPostSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CREATE_POST } from "@/lib/apiEndPoints";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

type CreatePostDialogProps = {
  open?: boolean;
  handleOpenCreatePostDialog?: () => void;
  user?: User;
};

interface FileWithPreview extends File {
  preview: string;
}

const CreatePostDialog = ({
  open,
  handleOpenCreatePostDialog,
  user,
}: CreatePostDialogProps) => {
  const router = useRouter();
  const [privatePost, setPrivatePost] = useState<boolean>(false);
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const handleCheckboxChange = () => {
    setPrivatePost(!privatePost);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(selectFile, {
        preview: URL.createObjectURL(selectFile),
      });
      setFile(fileWithPreview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 3000000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreatePostSchema>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handlePostSubmit = async (data: TCreatePostSchema) => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("description", data.description);

    if (user?.username) formData.append("username", user.username);

    if (user?.id) formData.append("user_id", user?.id);

    if (privatePost) {
      formData.append("publish", JSON.stringify(false));
    } else {
      formData.append("publish", JSON.stringify(true));
    }

    try {
      const response = await axios.post<ApiResponse>(CREATE_POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        return toast.error(response.data.message);
      }
      clearCache("all-post");
      open = false;
      if (privatePost) router.push("dashboard/profile");
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("something went wrong!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenCreatePostDialog}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <div>
          <form onSubmit={handleSubmit(handlePostSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-start w-full gap-1">
                <Label className="text-[13px]">Question Title</Label>
                <Input {...register("title")} type="text" />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <Label className="text-[13px]">
                  Detailed Question Description
                </Label>
                <Input {...register("description")} type="text" />
                {errors.description && (
                  <p className="text-sm text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border border-dashed h-32 w-full p-2 flex items-center justify-center text-muted-foreground text-sm ${
                  isDragActive ? "border-green-500" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} />

                {file ? (
                  <div key={file.name}>
                    <p>{file.name}</p>
                  </div>
                ) : (
                  <>
                    {isDragActive ? (
                      <p className="text-sm text-muted-foreground">
                        Drop the file here...
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag & Drop a file here, or click to select a file
                      </p>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <Checkbox
                    onClick={handleCheckboxChange}
                    checked={privatePost}
                  />
                  <span className="text-muted-foreground">
                    Make post private & use AI
                  </span>
                </label>
              </div>
              <div className="flex gap-4 ">
                {/* <Button
                  className="w-full"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Continue with AI
                </Button> */}
                <Button type="submit" className="">
                  Post
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
