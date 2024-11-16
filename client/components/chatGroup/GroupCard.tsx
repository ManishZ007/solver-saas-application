"use client";

import { FetchChatGroups } from "@/types/ApiResponse";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GroupCardMenu from "./GroupCardMenu";

type GroupCardProps = {
  groups: Array<FetchChatGroups>;
};

const GroupCard = ({ groups }: GroupCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center md:grid md:grid-cols-2 lg:grid-cols-3 gap-4  ">
      {groups.map((group, index) => (
        <Card key={index} className="w-[300px] cursor-pointer">
          <CardHeader className="flex-row justify-between items-center ">
            <CardTitle className="text-lg">{group.title}</CardTitle>
            <GroupCardMenu group={group} />
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              Passcode :-<strong>{group.password}</strong>
            </p>
            <p>Created At :-{new Date(group.created_at!).toDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GroupCard;
