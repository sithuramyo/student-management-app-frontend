import { z } from "zod";

export const facultyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  birthDate: z.object({
    year: z.number().min(1900, "Year is invalid"),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
    dayOfWeek: z.number().optional(),
  }),
  gender: z.union([z.string(), z.number()]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  status: z.union([z.string(), z.number()]),
  profile: z.string().url("Invalid URL for profile image"),
});

export type FacultyFormSchema = z.infer<typeof facultyFormSchema>;