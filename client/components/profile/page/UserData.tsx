"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/use-debounce";
import {
  CHECK_USERNAME_URL,
  POST_IMAGE_ENDPOINT,
  UPDATE_USER_PROFILE,
} from "@/lib/apiEndPoints";
import {
  EditProfileSchema,
  TEditProfileSchema,
} from "@/lib/validations/editProfileScheme";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Edit2, Loader2, Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UserDataProps = {
  user?: User;
  user_post?: Array<PostType> | [];
};

type UserDataType = {
  username?: string;
  email?: string;
};

const UserData = ({ user, user_post }: UserDataProps) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDataType>({
    username: user?.username,
    email: user?.email,
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const debounceUsername = useDebounce(userData.username);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  const { register, handleSubmit } = useForm<TEditProfileSchema>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  });

  useEffect(() => {
    const checkUsernameAvailable = async () => {
      if (userData.username) {
        setIsCheckingUsername(true);

        setUsernameMessage("");
        try {
          const response = await axios.post<ApiResponse>(CHECK_USERNAME_URL, {
            username: debounceUsername,
          });
          setUsernameMessage(response.data.message!);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameAvailable();
  }, [debounceUsername]);

  const handleChangeUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const onSubmit = async ({ username, email }: TEditProfileSchema) => {
    try {
      setLoading(true);

      const payload = {
        username,
        email,
        user_id: user?.id,
      };

      const response = await axios.post<ApiResponse>(
        UPDATE_USER_PROFILE,
        payload
      );

      if (response.data.success) {
        const newUpdateObject = {
          id: response.data.data?.id,
          firstname: response.data.data?.firstname,
          lastname: response.data.data?.lastname,
          email: response.data.data?.email,
          username: response.data.data?.username,
          profile_image: response.data.data?.profile_image,
        };

        await update(newUpdateObject);
      }

      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("somthing went wrong");
      }
    }
  };

  function truncateDescription(
    description: string,
    wordLimit: number = 8
  ): string {
    const words = description.split(" ");

    if (words.length <= wordLimit) {
      return description;
    }

    const truncatedWords = words.slice(0, wordLimit).join(" ");
    return `${truncatedWords}...`;
  }

  return (
    <section className="px-4 py-2 flex flex-col md:flex-row">
      <div className="p-3 flex  gap-4 flex-col items-center ">
        <div className="flex flex-row gap-4 md:flex-col">
          <div className="relative">
            <Image
              src={!user?.profile_image ? user?.image : user?.profile_image}
              alt="user profile"
              width={150}
              height={150}
              className=" h-auto w-[250px] bg-cover rounded-full outline outline-1 outline-gray-500"
            />
            <span
              className="absolute right-10 bottom-0 cursor-pointer "
              onClick={() => console.log("edit profile pic")}
            >
              <Edit2 className="h-5 w-5" />
            </span>
          </div>

          <div className="w-full items-start justify-start">
            <p className="text-[18px] md:text-[25px]">
              {session?.user.firstname} {session?.user?.lastname}
            </p>
            <p className="text-[15px] text-muted-foreground md:text-[17px] ">
              {session?.user?.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              coins {session?.user?.coin}
            </p>
          </div>
        </div>

        <div className="w-full">
          <Button
            size={`sm`}
            variant={`secondary`}
            className={`w-full ${isEditOpen ? "hidden" : "block"}`}
            onClick={() => setIsEditOpen(true)}
          >
            Edit profile
          </Button>
        </div>
        {isEditOpen && (
          <>
            <div className="w-full  items-start justify-start">
              <p className="text-sm text-muted-foreground mb-4 max-w-[250px]">
                Edit your profile by updating your username and email. Ensure
                details are accurate, then click &apos;Save&apos; to confirm
                changes.
              </p>
              <form
                className="w-full flex flex-col gap-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-start w-full gap-1">
                  <Label className="text-[12px]">Email</Label>
                  <Input
                    {...register("email")}
                    className="w-full h-8"
                    value={userData.email}
                    name="email"
                    onChange={handleChangeUserData}
                  />
                </div>

                <div className="flex flex-col items-start w-full gap-1">
                  <Label className="text-[12px]">Username</Label>
                  <Input
                    {...register("username")}
                    className="w-full h-8"
                    value={userData.username}
                    name="username"
                    onChange={handleChangeUserData}
                  />
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin h-3 w-3" />
                  )}
                  <p
                    className={`text-sm ${
                      usernameMessage == "username is available"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="p-2 rounded-md text-[13px] bg-[#16a34a] text-white"
                  >
                    {loading ? <Loader2Icon className="h-3 w-3" /> : "Save"}
                  </button>
                  <button
                    className="p-2 rounded-md text-[13px] bg-[#f4f4f5]"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      <div className="py-2 px-4 grid grid-cols-1 gap-4 md:grid-cols-2 ">
        {user_post?.map(({ description, id, title, username, post_image }) => (
          <div
            className="p-2 flex gap-4 cursor-pointer"
            key={id}
            onClick={() => router.push(`/dashboard/profile/post/${id}`)}
          >
            <div className="flex flex-col gap-1 ">
              <p>{username}</p>
              <p className="text-muted-foreground text-sm">{title}</p>
              <p className="text-muted-foreground text-sm">
                {truncateDescription(description)}
              </p>
            </div>
            <div>
              <Image
                width={150}
                height={150}
                className=" hidden md:block w-[160px] h-auto rounded-md"
                src={`${POST_IMAGE_ENDPOINT}/${post_image}`}
                alt="post image"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserData;
