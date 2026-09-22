"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { EventSchema, TEventSchema } from "@/lib/validations/eventSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { UPDATE_EVENT } from "@/lib/apiEndPoints";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";
import { useState } from "react";

type EditEventDialogProps = {
  open: boolean;
  event: EventType;
  onClose: () => void;
};

const EditEventDialog = ({ open, event, onClose }: EditEventDialogProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<TEventSchema>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event.title ?? "",
      date_of_event: event.date_of_event ? new Date(event.date_of_event) : new Date(),
    },
  });

  const onSubmit = async (data: TEventSchema) => {
    setLoading(true);
    try {
      const response = await axios.put<ApiResponse>(`${UPDATE_EVENT}/${event.id}`, {
        title: data.title,
        date_of_event: data.date_of_event,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        clearCache("event");
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Edit event</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_event"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of event</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
