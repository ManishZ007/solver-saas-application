"use client";

import { Button } from "../ui/button";
import SpringImage from "@/assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section className="pt-8 relative" ref={heroRef}>
      <div className="container flex flex-col items-center justify-center gap-6 text-center pt-9 ">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex relative">
            <h1 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">
              Empower Your Coding Journey with Solver
            </h1>
            <motion.div
              className="absolute right-[776px] top-[40px] hidden sm:inline"
              drag
              dragSnapToOrigin
            >
              <motion.img
                src={SpringImage.src}
                height="300"
                width="300"
                alt="spring"
                className="max-w-none"
                draggable="false"
                style={{
                  translateY: translateY,
                }}
              />
            </motion.div>
          </div>

          <p className="text-center mt-5 text-xl text-muted-foreground">
            Join a thriving community of coders, solve real-world coding
            problems with the power of collaboration, and enhance your skills
            with AI-driven solutions. Whether youre a beginner or a pro, Collad
            Solver helps you find answers faster, learn smarter, and code with
            confidence.
          </p>
        </div>

        <Button className="mt-2" size={`sm`}>
          Get for free
        </Button>
      </div>
    </section>
  );
};

export default Hero;
