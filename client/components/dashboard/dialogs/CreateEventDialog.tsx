"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import React, { useState } from "react";
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
import { CREATE_EVENT } from "@/lib/apiEndPoints";
import { ApiResponse } from "@/types/ApiResponse";
import { clearCache } from "@/actions/comman";

type CreateEventDialogProps = {
  open: boolean;
  handleOpenEventDialog: () => void;
  user?: User;
};

const CreateEventDialog = ({
  open,
  handleOpenEventDialog,
  user,
}: CreateEventDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<TEventSchema>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      date_of_event: new Date(),
    },
  });

  const onSubmit = async (data: TEventSchema) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        date_of_event: data.date_of_event,
        user_id: user?.id,
      };

      const response = await axios.post<ApiResponse>(CREATE_EVENT, {
        payload,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        clearCache("event");
        handleOpenEventDialog();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenEventDialog}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <p className="text-sm">create a event</p>

          <div className="flex flex-col gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
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
                      <FormLabel>create event</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
