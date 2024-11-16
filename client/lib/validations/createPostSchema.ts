import z from "zod";

export const CreatePostSchema = z.object({
  title: z
    .string({ message: "Summarize your question in a clear, concise way." })
    .min(3, "Title must be atleast 2 characters"),

  description: z.string({
    message:
      "Provide all necessary details, including background, code snippets, and any attempted solutions.",
  }),
});

export type TCreatePostSchema = z.infer<typeof CreatePostSchema>;
