"use client";

import React from "react";
import { Separator } from "../ui/separator";
import Section1Img from "@/assets/useAI.png";
import Image from "next/image";

const Section1 = () => {
  return (
    <section className="py-[70px] overflow-x-clip ">
      <div className="container">
        <div className="md:flex gap-6 items-center justify-center">
          <div className="max-w-[478px]">
            <h2 className="text-3xl  font-bold tracking-tighter">
              Empowering Coders to Solve Complex Problems
            </h2>
            <p className=" tracking-tight mt-6">
              At Solver, our mission is to bring together a global community of
              problem solvers who are passionate about coding and innovation.
              Whether youre a beginner or an experienced developer, Solver
              provides the platform and tools to overcome challenges, learn, and
              grow together.
            </p>
          </div>

          <div className="mt-20 md:mt-0  md:flex-1 relative">
            <Image
              src={Section1Img}
              alt="product showcase"
              className="mt-14 rounded-xl"
            />
          </div>
        </div>

        <Separator className="mt-10" />
      </div>
    </section>
  );
};

export default Section1;
