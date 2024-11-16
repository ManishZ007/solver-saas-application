import z from "zod";
import { UsernameValidation } from "./userSchema";

export const EditProfileSchema = z.object({
  username: UsernameValidation,
  email: z.string().email({
    message: "email is required",
  }),
});

export type TEditProfileSchema = z.infer<typeof EditProfileSchema>;
