"use client";

import { getSocket } from "@/lib/socket.config";
import { FetchChatGroups } from "@/types/ApiResponse";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Code2, MessageCircle, Send, Bot } from "lucide-react";
import { v4 as uuidV4 } from "uuid";
import dynamic from "next/dynamic";
import axios from "axios";
import { AI_RESPONSE_URL } from "@/lib/apiEndPoints";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp", "go", "rust", "html", "css"];

type ChatContainerProps = {
  chatUser?: GroupChatUserType;
  group: FetchChatGroups;
  oldMessage: Array<MessageType>;
};

const ChatContainer = ({ chatUser, group, oldMessage }: ChatContainerProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessage);
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat");
  const [code, setCode] = useState<string>("// Start coding here...\n");
  const [language, setLanguage] = useState<string>("javascript");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRemoteUpdate = useRef(false);

  const socket = useMemo(() => {
    const s = getSocket();
    s.auth = { room: group.id };
    return s;
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("recive-message", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("code-update", (data: { code: string; language: string }) => {
      isRemoteUpdate.current = true;
      setCode(data.code);
      setLanguage(data.language);
    });

    return () => {
      socket.off("recive-message");
      socket.off("code-update");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }
      const newCode = value ?? "";
      setCode(newCode);
      socket.emit("code-change", { code: newCode, language });
    },
    [language, socket]
  );

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    socket.emit("code-change", { code, language: lang });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    // /ai command
    if (message.trim().startsWith("/ai ")) {
      const question = message.trim().slice(4);
      setMessage("");
      setAiLoading(true);

      const userMsg: MessageType = {
        id: uuidV4(),
        message: `/ai ${question}`,
        username: chatUser?.username ?? "Unknown",
        created_at: new Date().toISOString(),
        group_id: group.id,
      };
      socket.emit("message", userMsg);

      try {
        const res = await axios.post<{ success: boolean; message: string }>(
          AI_RESPONSE_URL,
          { prompt: question }
        );
        const botMsg: MessageType = {
          id: uuidV4(),
          message: res.data.message,
          username: "AI Bot",
          created_at: new Date().toISOString(),
          group_id: group.id,
        };
        socket.emit("message", botMsg);
      } catch {
        const errMsg: MessageType = {
          id: uuidV4(),
          message: "AI is unavailable right now. Please try again.",
          username: "AI Bot",
          created_at: new Date().toISOString(),
          group_id: group.id,
        };
        socket.emit("message", errMsg);
      } finally {
        setAiLoading(false);
      }
      return;
    }

    const payload: MessageType = {
      id: uuidV4(),
      message,
      username: chatUser?.username ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };

    socket.emit("message", payload);
    setMessage("");
  };

  return (
    <div className="relative h-[80vh] w-full flex flex-col">
      {/* Tab bar */}
      <div className="flex gap-2 px-4 pt-2 border-b">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-t-md transition-colors ${
            activeTab === "chat"
              ? "bg-background border border-b-background -mb-px font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" /> Chat
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-t-md transition-colors ${
            activeTab === "code"
              ? "bg-background border border-b-background -mb-px font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Live Code
        </button>
      </div>

      {/* Chat tab */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto container">
            <div className="w-full md:w-[80%] mx-auto flex flex-col gap-4 py-4">
              {messages?.map((msg, index) => {
                const isBot = msg.username === "AI Bot";
                const isMe = msg.username === chatUser?.username;
                return (
                  <div
                    key={index}
                    ref={messagesEndRef}
                    className={`w-full flex flex-col gap-1 ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <span className={`text-xs ${isBot ? "text-blue-500 font-medium" : "text-muted-foreground"}`}>
                      {isBot && <Bot className="inline w-3 h-3 mr-1" />}
                      {msg.username}
                    </span>
                    <p
                      className={`p-2 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
                        isBot
                          ? "bg-blue-50 dark:bg-blue-950 text-foreground border border-blue-200 dark:border-blue-800"
                          : isMe
                          ? "dark:bg-white dark:text-black bg-black text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full px-4 pb-3 flex gap-2 justify-center"
          >
            <div className="w-full md:w-[80%] flex gap-2">
              <Input
                className="flex-1"
                placeholder='Message... or "/ai your question"'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                disabled={aiLoading}
              />
              <Button variant="default" size="icon" type="submit" disabled={aiLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
          {aiLoading && (
            <p className="text-center text-xs text-blue-500 pb-1 animate-pulse">AI is thinking...</p>
          )}
        </div>
      )}

      {/* Live Code tab */}
      {activeTab === "code" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border-b">
            <span className="text-xs text-muted-foreground">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs bg-background border rounded px-2 py-0.5 outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <span className="ml-auto text-xs text-muted-foreground">
              Changes sync live with everyone in the room
            </span>
          </div>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
