"use client";

const Advertisement = () => {
  return (
    <div
      className={` hidden md:hidden lg:hidden  w-full md:max-w-[300px] max-h-[500px] overflow-y-auto p-4 xl:flex flex-col gap-2  border border-solid boredr-[#222222]/10 rounded-3xl `}
    >
      <p className="">About Our Platform</p>
      <p className="text-muted-foreground text-sm">
        Join our coding solutions platform where developers come together to
        solve problems, share knowledge, and collaborate. Submit your coding
        challenges and get support from a community eager to help, discuss
        approaches, and share insights. For those seeking faster, AI-driven
        assistance, our premium feature offers quick, efficient answers. Create
        or join chat groups to collaborate on projects, brainstorm, and connect
        with peers. Whether you’re a beginner seeking guidance or an experienced
        coder looking to contribute, our platform is the ideal space for
        problem-solving, learning, and growth. Be part of a community where
        coding challenges are met with solutions and your development journey is
        supported.
      </p>
    </div>
  );
};

export default Advertisement;
