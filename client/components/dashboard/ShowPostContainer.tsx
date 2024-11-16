import React from "react";
import Post from "../post/Post";

type ShowPostContainerProps = {
  posts?: Array<PostType> | [];
  user?: User;
  ratings?: Array<RatingsType>;
};

const ShowPostContainer = ({ posts, user }: ShowPostContainerProps) => {
  return (
    <section className="p-4 flex flex-col gap-2">
      {posts?.map((post, index) => (
        <Post key={index} post={post} user={user} />
      ))}
    </section>
  );
};

export default ShowPostContainer;
