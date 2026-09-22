"use client";

import { checkDateStatus } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { DELETE_EVENT } from "@/lib/apiEndPoints";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";
import EditEventDialog from "./dialogs/EditEventDialog";

type ShowEventsContainerProps = {
  events: Array<EventType> | [];
};

const ShowEventsContainer = ({ events }: ShowEventsContainerProps) => {
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse>(`${DELETE_EVENT}/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        clearCache("event");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="w-full max-h-[200px] overflow-y-auto scroll no-scrollbar md:max-w-[360px] my-2 p-3 flex flex-col gap-2 text-center items-center">
        {events.map((event, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 border border-solid boredr-[#222222]/10 rounded p-3 items-start justify-start"
          >
            <div className="flex w-full items-center justify-between">
              <p className="text-sm">{event.title}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    checkDateStatus(event.date_of_event as string)
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />
                <Pencil
                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingEvent(event)}
                />
                <Trash2
                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(event.id as string)}
                />
              </div>
            </div>
            <p className="text-sm">
              date {new Date(event.date_of_event as string).toDateString()}
            </p>
          </div>
        ))}
      </div>

      {editingEvent && (
        <EditEventDialog
          open={!!editingEvent}
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  );
};

export default ShowEventsContainer;
