import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CreateChatGroup } from "@/components/chatGroup/CreateChatGroup";
import GroupCard from "@/components/chatGroup/GroupCard";
import { fetchChatGroup } from "@/fetch/groupFetch";
import { FetchChatGroups } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import React from "react";

const Chat = async () => {
  const session = await getServerSession(authOptions);

  const groups: Array<FetchChatGroups> | [] = await fetchChatGroup(
    session?.user?.id as string
  );

  return (
    <section className="container">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl  font-bold tracking-tighter">
            Manage Your Chat Groups
          </h2>
          <p className=" tracking-tight mt-6">
            Create and manage chat groups to collaborate with your community,
            share ideas, and work together efficiently. You can easily create
            multiple groups, invite members, and organize conversations.
            However, please be aware that deleting a chat group will result in
            the permanent loss of all associated messages, files, and data. This
            action is irreversible, and there is no option to recover the
            deleted information.
          </p>
        </div>
        <div className="flex justify-end w-full">
          <CreateChatGroup user_id={session?.user.id as string} />
        </div>
        <div>
          <GroupCard groups={groups} />
        </div>
      </div>
    </section>
  );
};

export default Chat;
