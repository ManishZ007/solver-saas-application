import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import UserContainer from "@/components/dashboard/UserContainer";
import PostContainer from "@/components/dashboard/PostContainer";
import Advertisement from "@/components/dashboard/Advertisement";
import { fetchAllEvent, fetchAllPosts } from "@/fetch/groupFetch";
import ShowEventsContainer from "@/components/dashboard/ShowEventsContainer";
import { clearCache } from "@/actions/comman";

const dashboard = async () => {
  await clearCache("all-post");
  const session = await getServerSession(authOptions);

  const allEvent = await fetchAllEvent(session?.user?.id as string);
  const allPosts = await fetchAllPosts();

  return (
    <div className="flex gap-5 items-start">
      {/* Left column */}
      <aside className="hidden md:flex flex-col gap-4 w-[240px] shrink-0 sticky top-6">
        <UserContainer user={session?.user} />
        <ShowEventsContainer events={allEvent} />
      </aside>

      {/* Center — main feed */}
      <section className="flex-1 min-w-0">
        <PostContainer user={session?.user} posts={allPosts} />
      </section>

      {/* Right column */}
      <Advertisement />
    </div>
  );
};

export default dashboard;
