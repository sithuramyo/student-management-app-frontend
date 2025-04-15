import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"), // You can customize this

  role: z
    .number({ required_error: "Role is required" }),

  profile: z.string().url("Invalid URL for profile image"),
});

export type FormSchema = z.infer<typeof formSchema>;
