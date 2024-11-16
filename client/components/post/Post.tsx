"use client";

import { POST_IMAGE_ENDPOINT, SOLUTION_HANDLING } from "@/lib/apiEndPoints";
import { ChevronUp, ChevronDown, ThumbsUp, SendHorizonal } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
// import { toast } from "sonner";
import { getSocket } from "@/lib/socket.config";
import { Input } from "../ui/input";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";

type PostProps = {
  post?: PostType;
  user?: User;
};

const Post = ({ post, user }: PostProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [solutionsId, setSolutionsId] = useState<Array<string> | []>([]);
  const [solution, setSolution] = useState<string>("");

  useEffect(() => {
    const userRatedsolutions: string[] = [];

    post?.Solutions?.forEach((solution: SolutionType) => {
      const hasUserRated = solution.Ratings?.some(
        (rating: RatingsType) => rating.user_id === user?.id
      );

      if (hasUserRated) {
        userRatedsolutions.push(solution.id.toString());
      }
    });

    setSolutionsId(userRatedsolutions);
  }, []);

  const hasUserRatedThisSolution = (solution_id: string) => {
    return solutionsId.some((solution) => solution === solution_id);
  };

  const socket = useMemo(() => {
    const socket = getSocket();

    return socket.connect();
  }, []);

  useEffect(() => {
    socket.on("remove-solution-rating", (data: string) => {
      setSolutionsId((prevIds) => prevIds.filter((id) => id !== data));
    });

    socket.on("recive-solutionId", (data: string) => {
      setSolutionsId((prevSolutionId) => [...prevSolutionId, data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleGiveARating = async (solution?: SolutionType) => {
    const paylaod = {
      user_id: user?.id,
      solution_id: solution?.id,
    };

    socket.emit("send-rating", paylaod);
  };

  const handleSubmitSolution = async (post_id?: string) => {
    try {
      if (solution === "") {
        return toast.error("empty solution not recommended");
      }

      const payload = {
        post_id: post_id,
        solution: solution,
        username: user?.username,
      };

      const resposne = await axios.post<ApiResponse>(
        SOLUTION_HANDLING,
        payload
      );

      if (!resposne.data.success) {
        toast.error(resposne.data.message);
      }
      setSolution("");
      clearCache("all-post");
      toast.success(resposne.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("try again letter");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 cursor-pointer items-center ">
        <div className="gap-2">
          <p className="w-8 h-8 rounded-full  border flex items-center justify-center text-sm">
            {post?.username?.charAt(0)}
          </p>
        </div>
        <p className="text-sm">{post?.username}</p>
      </div>

      <h1 className="font-bold ">{post?.title}</h1>
      <Image
        src={`${POST_IMAGE_ENDPOINT}/${post?.post_image}`}
        alt="post"
        width={600}
        height={600}
        className="w-full h-auto rounded-sm"
      />
      <p className="text-sm tracking-tighter">{post?.description}</p>
      <div className=" flex gap-2">
        <Input
          placeholder="solution"
          className="focus:outline-none focus:ring-0 outline-none focus:border-none"
          onChange={(e) => setSolution(e.target.value)}
        />
        <Button onClick={() => handleSubmitSolution(post?.id)} size={`icon`}>
          <SendHorizonal className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-2">
        <div className="flex justify-between mb-3">
          <p className="text-muted-foreground">
            {post?.Solutions?.length} Answer
          </p>
          <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="p-2 border border-dashed rounded-md"
            >
              {post?.Solutions?.map((solution, index) => {
                return (
                  <div className="flex flex-col gap-2" key={index}>
                    <p className="text-muted-foreground">{solution.username}</p>

                    <p className="text-sm tracking-tighter">
                      {solution.solution}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size={"icon"}
                        variant={`ghost`}
                        onClick={() => handleGiveARating(solution)}
                      >
                        <ThumbsUp
                          style={{
                            fill: hasUserRatedThisSolution(
                              solution.id as string
                            )
                              ? "red"
                              : "",
                          }}
                          className={`h-5 w-5 `}
                        />
                      </Button>

                      <p>
                        {solutionsId.filter((id) => id === solution.id).length}
                      </p>
                    </div>
                    <Separator className="my-2" />
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Post;
