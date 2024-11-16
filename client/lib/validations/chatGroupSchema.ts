import z from "zod";

export const createGroupSchema = z
  .object({
    title: z.string().min(5, {
      message: "password must be atleast 5 characters",
    }),
    password: z
      .string({
        message: "password is required",
      })
      .min(3, {
        message: "password must be atleast 3 characters",
      }),
  })
  .required();

export type TCreateGroupSchema = z.infer<typeof createGroupSchema>;

export const EditChatGroupSchema = createGroupSchema;
export type TEditChatGroupSchema = z.infer<typeof EditChatGroupSchema>;

export const ValidUserSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be atleast 2 characters",
    })
    .max(20, { message: "Username must be no more then 20 characters" }),
  password: z
    .string({
      message: "password is required",
    })
    .min(3, {
      message: "password must be atleast 3 characters",
    }),
});

export type TValidUserSchema = z.infer<typeof ValidUserSchema>;
