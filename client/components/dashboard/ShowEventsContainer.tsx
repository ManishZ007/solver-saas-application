"use client";

import { checkDateStatus } from "@/lib/utils";
import { Pencil, Trash2, CalendarClock, Clock } from "lucide-react";
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
      <div className="md:min-w-[240px] rounded-2xl border bg-card">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">My Events</span>
          {events.length > 0 && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {events.length}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0 max-h-[260px] overflow-y-auto no-scrollbar divide-y">
          {events.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              No events yet
            </div>
          ) : (
            events.map((event, index) => {
              const isPast = checkDateStatus(event.date_of_event as string);
              return (
                <div key={index} className="px-4 py-3 flex items-start gap-2 hover:bg-muted/40 transition-colors group">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isPast ? "bg-red-400" : "bg-green-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(event.date_of_event as string).toDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingEvent(event)}>
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button onClick={() => handleDelete(event.id as string)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
