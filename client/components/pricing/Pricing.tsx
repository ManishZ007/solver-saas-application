"use client";

import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/constants";
import { CheckIcon, StarIcon } from "lucide-react";
import StarImage from "@/assets/star.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CREDIT_FREE_COIN_URL } from "@/lib/apiEndPoints";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PricingProps = {
  user?: User;
};

const Pricing = ({ user }: PricingProps) => {
  const pricingRef = useRef(null);
  const { update } = useSession();
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: pricingRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const handleSubmitCheckout = async (price: string) => {
    try {
      if (price == "$0") {
        if (!user?.free_coin_use) {
          const payload = {
            coin: 3,
            free_coin_use: true,
          };

          const response = await axios.post<ApiResponse>(
            `${CREDIT_FREE_COIN_URL}/?user_id=${user?.id}`,
            payload
          );

          if (response.data.success) {
            const updatePayload = {
              coin: response.data.data?.coin,
              free_coin_use: response.data.data?.free_coin_use,
            };
            await update(updatePayload);
            router.push("/dashboard/profile");
            toast.success(response.data.message);
          }
        } else {
          toast.error("use already credit your free coins");
        }
      } else {
        router.push(`/dashboard/payment/${price.split("$")[1]}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("somthing went wrong!");
      }
    }
  };

  return (
    <section className="py-[70px] overflow-x-clip">
      <div className="container text-center">
        <div className="max-w-[540px] mx-auto">
          <div className="inline-flex relative">
            <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter">
              Find Your Perfect Plan
            </h2>
            <motion.div
              className="absolute right-[500px] top-[40px] hidden sm:inline"
              drag
              dragSnapToOrigin
            >
              <motion.img
                src={StarImage.src}
                alt="star image"
                height="300"
                width="300"
                className="max-w-none"
                draggable="false"
                style={{
                  translateY: translateY,
                }}
              />
            </motion.div>
          </div>

          <p className="text-center mt-5 text-xl text-muted-foreground">
            Unlock the full potential of Solver with plans designed to fit every
            stage of your coding adventure. Explore our options to discover the
            best value for your needs.
          </p>
        </div>
        <div className="flex flex-col gap-5 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingPlans.map(
            ({ name, buttonText, features, price, popular }, i) => (
              <div
                className="p-9 border border-solid boredr-[#222222]/10 rounded-3xl max-w-xs w-full"
                key={i}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold">{name}</h3>
                  {popular && (
                    <>
                      <StarIcon className="h-5 w-5" />
                    </>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    {price}
                  </span>
                  <span className="tracking-tighter font-bold">/month</span>
                </div>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center gap-4">
                      <CheckIcon className="h-6 w-6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-[30px] w-full">
                  <Button onClick={() => handleSubmitCheckout(price)}>
                    {buttonText}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
