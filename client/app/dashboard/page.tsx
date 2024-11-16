import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import UserContainer from "@/components/dashboard/UserContainer";
import PostContainer from "@/components/dashboard/PostContainer";
import Advertisement from "@/components/dashboard/Advertisement";
import {
  fetchAllEvent,
  fetchAllPosts,
  // fetchAllUserRating,
} from "@/fetch/groupFetch";
import ShowEventsContainer from "@/components/dashboard/ShowEventsContainer";
import { clearCache } from "@/actions/comman";

const dashboard = async () => {
  await clearCache("all-post");
  const session = await getServerSession(authOptions);

  const allEvent = await fetchAllEvent(session?.user?.id as string);

  const allPosts = await fetchAllPosts();

  // const allRatings = await fetchAllUserRating(session?.user.id as string);

  return (
    <section className="px-1 ">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col gap-3">
          <UserContainer user={session?.user} />
          <ShowEventsContainer events={allEvent} />
        </div>

        <PostContainer user={session?.user} posts={allPosts} />
        <Advertisement />
      </div>
    </section>
  );
};

export default dashboard;
