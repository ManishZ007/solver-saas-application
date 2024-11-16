"use client";

import React, { useRef } from "react";
import Image from "next/image";
import appScreen from "@/assets/product.png";
import { motion, useScroll, useTransform } from "framer-motion";

const ProductShowcase = () => {
  const appImage = useRef<HTMLImageElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: appImage,
    offset: ["start end", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <div>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tighter">
            Transform Your Coding Experience
          </h2>

          <p className="text-xl text-center text-muted-foreground mt-5">
            Solver revolutionizes your coding journey with AI-driven insights
            and community collaboration. Simplify problem-solving, enhance your
            skills, and speed up your development process with our powerful
            platform.
          </p>
        </div>
        <motion.div
          style={{
            opacity: opacity,
            rotateX: rotateX,
            transformPerspective: "800px",
          }}
        >
          <Image
            src={appScreen}
            alt="product showcase"
            className="mt-14 rounded-2xl"
            ref={appImage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductShowcase;
