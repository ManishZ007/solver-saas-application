"use client";

import React from "react";
import CreatePostContainer from "./CreatePostContainer";
import ShowPostContainer from "./ShowPostContainer";

type PostContainerProps = {
  user?: User;
  posts?: Array<PostType> | [];
};

const PostContainer = ({ user, posts }: PostContainerProps) => {
  return (
    <section className="w-full ">
      <div className="flex flex-col gap-3 ">
        <CreatePostContainer user={user} />

        <ShowPostContainer posts={posts} user={user} />
      </div>
    </section>
  );
};

export default PostContainer;
