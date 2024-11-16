import { getSocket } from "@/lib/socket.config";
import { FetchChatGroups } from "@/types/ApiResponse";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { v4 as uuidV4 } from "uuid";

type ChatContainerProps = {
  chatUser?: GroupChatUserType;
  group: FetchChatGroups;
  oldMessage: Array<MessageType>;
};

const ChatContainer = ({ chatUser, group, oldMessage }: ChatContainerProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = useMemo(() => {
    const socket = getSocket();

    socket.auth = {
      room: group.id,
    };

    return socket.connect();
  }, []);

  useEffect(() => {
    socket.on("recive-message", (data: MessageType) => {
      setMessages((prevMessages) => [...prevMessages!, data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: MessageType = {
      id: uuidV4(),
      message: message,
      username: chatUser?.username ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };

    socket.emit("message", payload);
    setMessage("");
  };

  return (
    <div className="relative  h-[80vh] w-full">
      <div className="container flex overflow-y-auto flex-col items-center justify-center">
        <div className=" w-full md:w-[80%] h-[71vh]">
          <div className="flex flex-col gap-4">
            {messages?.map((message, index) => (
              <div
                className={`w-full py-2 flex flex-col gap-1 ${
                  message.username === chatUser?.username
                    ? "items-end justify-end"
                    : "items-start justify-normal"
                }`}
                key={index}
                ref={messagesEndRef}
              >
                <span className="text-muted-foreground ">
                  {message.username}
                </span>
                <p className="dark:bg-white dark:text-black bg-black text-white p-2 rounded flex ">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="absolute bottom-3 w-full md:w-[80%] flex gap-2 text-center justify-center"
        >
          <Input
            className="w-full md:w-[80%]"
            placeholder="Message...."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button variant={`default`} size={`icon`} type="submit">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
