import { z } from "zod";

export const studentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  birthDate: z.object({
    year: z.number().min(1900, "Year is invalid"),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
    dayOfWeek: z.number().optional(),
  }),
  gender: z.number({ required_error: "Gender is required" }).optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.number({ required_error: "Status is required" }).optional(),
  profile: z.string().url("Invalid URL for profile image"),
});

export type StudentFormSchema = z.infer<typeof studentFormSchema>;

export const guardianFormSchema = z.object({
  guardianName: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  guardianEmail: z.string().email("Invalid email"),
  guardianAddress: z.string().min(1, "Address is required"),
});

export type GuardianFormSchema = z.infer<typeof guardianFormSchema>;
