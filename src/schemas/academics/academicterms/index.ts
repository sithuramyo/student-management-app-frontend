import { z } from "zod";


export const formSchema = z.object({
    name: z.string().min(1, "Name code is required"),
    startDate: z.object({
        year: z.number().min(1900, "Year is invalid"),
        month: z.number().min(1).max(12),
        day: z.number().min(1).max(31),
        dayOfWeek: z.number().optional(),
    }),
    endDate: z.object({
        year: z.number().min(1900, "Year is invalid"),
        month: z.number().min(1).max(12),
        day: z.number().min(1).max(31),
        dayOfWeek: z.number().optional(),
    }),
    profile: z.string().url("Invalid URL for profile image"),
});


export type FormSchema = z.infer<typeof formSchema>;