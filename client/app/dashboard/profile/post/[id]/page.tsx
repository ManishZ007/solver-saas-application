"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  AI_RESPONSE_URL,
  CREDIT_FREE_COIN_URL,
  POST_IMAGE_ENDPOINT,
  SINGLE_POST,
} from "@/lib/apiEndPoints";
import { toast } from "sonner";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Tesseract from "tesseract.js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [OCRResponse, setOCRResponse] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, update } = useSession();

  async function performOCR(imagePath: string): Promise<string> {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, "eng");

      return text;
    } catch (error) {
      console.error("Error during OCR:", error);
      return "OCR process failed";
    }
  }

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${SINGLE_POST}/?id=${id}`
        );
        setPost(response?.data?.post);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message);
        } else {
          toast.error("somthing went wrong!");
        }
      }
    };

    fetchPostData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (Number(session?.user?.coin) > 0) {
        await performOCR(`${POST_IMAGE_ENDPOINT}/${post?.post_image}`)
          .then((result) => {
            setOCRResponse(result);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        const payload = {
          prompt: userQuestion + ", " + "image content is" + " " + OCRResponse,
        };

        const resposne = await axios.post<ApiResponse>(
          AI_RESPONSE_URL,
          payload
        );
        setAiResponse(resposne?.data?.message);
        setLoading(false);

        const payloadCoinMinus = {
          coin: Number(session?.user.coin) - 1,
        };

        const coinminusResponse = await axios.post<ApiResponse>(
          `${CREDIT_FREE_COIN_URL}/?user_id=${session?.user?.id}`,
          payloadCoinMinus
        );

        if (coinminusResponse.data.success) {
          const updatePayload = {
            coin: coinminusResponse.data.data?.coin,
            free_coin_use: coinminusResponse.data.data?.free_coin_use,
          };
          await update(updatePayload);

          toast.success(`${session?.user.coin} remaining`);
        }
      } else {
        toast.error("use dont have coins");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("something went wrong!");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row  gap-10  justify-center">
        <div className="flex flex-col gap-2 max-w-[680px]">
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

          <div className="p-2">
            <div className="flex justify-between mb-3">
              <p className="text-muted-foreground">
                {post?.Solutions?.length} Answer
              </p>
            </div>

            <div className="p-2 border border-dashed rounded-md">
              {post?.Solutions?.map((solution, index) => {
                return (
                  <div className="flex flex-col gap-2" key={index}>
                    <p className="text-muted-foreground">{solution.username}</p>

                    <p className="text-sm tracking-tighter">
                      {solution.solution}
                    </p>

                    <Separator className="my-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-4 md:mt-16 w-full h-[300px] flex flex-col gap-2 md:max-w-[380px]">
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground leading-6">
              Ask your question to the AI and write what you need.
            </Label>
            <Textarea
              placeholder="say"
              onChange={(e) => setUserQuestion(e.target.value)}
            />
            <Button onClick={() => handleSubmit()}>
              {loading ? (
                <>
                  Processing <Loader2 className="ml-2 animate-spin w-3 h-3" />
                </>
              ) : (
                <>Process</>
              )}
            </Button>
          </div>
          <p className="mt-4 text-sm">{aiResponse}</p>
        </div>
      </div>
    </>
  );
};

export default Post;
