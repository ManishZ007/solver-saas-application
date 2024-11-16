import z from "zod";

export const EventSchema = z.object({
  title: z.string().min(6, "Title must be atleast 6 characters"),

  date_of_event: z.date({ message: "Date is mandatory" }),
});

export type TEventSchema = z.infer<typeof EventSchema>;
