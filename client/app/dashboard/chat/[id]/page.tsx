import ChatBase from "@/components/chat/ChatBase";
import ShowUsers from "@/components/chat/ShowUsers";
import {
  fetchAllChats,
  fetchChatGroupUsers,
  fetchGroupChat,
} from "@/fetch/groupFetch";
import { FetchChatGroups } from "@/types/ApiResponse";
import { notFound } from "next/navigation";
import React from "react";

const chat = async ({ params }: { params: { id: string } }) => {
  if (params.id.length !== 36) {
    return notFound;
  }

  const group: FetchChatGroups | null = await fetchGroupChat(params.id);

  if (group == null) {
    return notFound;
  }

  const getChatGroupUsers = await fetchChatGroupUsers(params?.id);

  const getAllChat = await fetchAllChats(params?.id);

  return (
    <section className="flex flex-col">
      <div>
        <ShowUsers users={getChatGroupUsers} />
      </div>
      <ChatBase group={group} oldMessage={getAllChat} />
    </section>
  );
};

export default chat;
