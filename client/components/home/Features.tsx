"use client";

import { features } from "@/constants";
import { Feather } from "lucide-react";
import TubeImage from "@/assets/tube.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Features = () => {
  const featuresRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [10, -150]);

  return (
    <div className="py-[72px]" ref={featuresRef}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex relative">
            <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter ">
              Unleash the Power of Collaborative Problem Solving
            </h2>

            <motion.div
              className="absolute left-[750px] hidden md:inline"
              drag
              dragSnapToOrigin
            >
              <motion.img
                src={TubeImage.src}
                alt="tubeImage"
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
            Discover a smarter way to tackle coding challenges with
            community-driven insights and AI-powered assistance. Your solutions,
            faster and more efficient.
          </p>
        </div>

        <div className="mt-16  flex flex-col sm:flex-row gap-4 ">
          {features.map(({ title, description }, index) => (
            <div
              key={index}
              className="border border-white/30 px-5 py-10 text-center rounded-xl sm:flex-1"
            >
              <div className="inline-flex h-14 w-14 text-muted-foreground justify-center items-center rounded-lg">
                <Feather />
              </div>

              <h1 className="mt-6 font-bold">{title}</h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
