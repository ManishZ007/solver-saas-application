"use client";

import { FAQs } from "@/constants";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AccordingItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className="py-7 border-b border-white/30"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center ">
        <span className="flex-1 text-lg font-bold">{question}</span>
        {isOpen ? <Minus /> : <Plus />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: "16px",
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="py-[72px]">
      <div className="container">
        <div className="max-w-[740px] mx-auto">
          <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-center text-muted-foreground mt-5">
            Find answers to common queries and learn more about how Solver can
            enhance your coding experience. If you have more questions, feel
            free to reach out to our support team.
          </p>
        </div>

        <div className="mt-12 max-w-[740px] mx-auto">
          {FAQs.map(({ question, answer }, index) => (
            <AccordingItem question={question} answer={answer} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
