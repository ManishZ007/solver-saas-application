import { clearCache } from "@/actions/comman";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Profile from "@/components/profile/Profile";
import { fetchUserPosts } from "@/fetch/groupFetch";
import { getServerSession } from "next-auth";
import React from "react";

const profile = async () => {
  await clearCache("user_post");
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  const user_post = await fetchUserPosts(session?.user.id as string);

  console.log(user_post);

  return (
    <section className="px-1">
      <Profile user={session?.user} user_post={user_post} />
    </section>
  );
};

export default profile;
