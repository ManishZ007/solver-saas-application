"use client";

import { aboutKeyFeature, aboutPageSections } from "@/constants";
import { Separator } from "../ui/separator";
import { ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const Section2 = () => {
  const router = useRouter();

  return (
    <section className="py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4">
          {aboutPageSections.map(({ section, headline, description }) => (
            <div key={section}>
              <div className="p-5">
                <h2 className="text-3xl  font-bold tracking-tighter">
                  {headline}
                </h2>
                <p className=" tracking-tight mt-6 md:max-w-[800px]">
                  {description}
                </p>

                <div
                  className="flex gap-3 items-center mt-5 cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <p>explore</p>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <Separator className="my-3" />
            </div>
          ))}
        </div>
        <div className="mt-16  flex flex-col sm:flex-row gap-4 ">
          {aboutKeyFeature.map(({ title, subtitle }, index) => (
            <div
              key={index}
              className="border border-white/10 px-5 py-4 text-center rounded-xl sm:flex-1"
            >
              <div className="inline-flex h-10 w-10 text-muted-foreground justify-center items-center rounded-lg">
                <Star />
              </div>
              <h1 className="mt-6 font-bold">{title}</h1>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;
