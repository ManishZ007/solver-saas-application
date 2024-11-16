"use client";

import { FetchChatGroups } from "@/types/ApiResponse";
import { useEffect, useState } from "react";
import ValidUserDialog from "./ValidUserDialog";
import ChatContainer from "./ChatContainer";

type ChatBaseProps = {
  group: FetchChatGroups;
  oldMessage: Array<MessageType> | [];
};

const ChatBase = ({ group, oldMessage }: ChatBaseProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const [chatUser, setChatUser] = useState<GroupChatUserType>();

  const handleValidUser = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const data = localStorage.getItem(group.id as string);

    if (data) {
      const pData = JSON.parse(data);

      setChatUser(pData);
    }
  }, [group.id]);

  return (
    <div className="">
      {open && (
        <ValidUserDialog
          group={group}
          handleValidUser={handleValidUser}
          open={open}
        />
      )}
      <ChatContainer
        chatUser={chatUser}
        group={group}
        oldMessage={oldMessage}
      />
    </div>
  );
};

export default ChatBase;
