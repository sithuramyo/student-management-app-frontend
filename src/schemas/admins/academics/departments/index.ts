import { z } from "zod";


export const formSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),
    phoneNumber: z
        .string()
        .regex(/^09\d{7,9}$/, {
            message: "Phone number must start with 09 and contain only numbers",
        })
        .optional(),
    email: z
        .string()
        .email("Invalid email address")
        .nullable()
        .optional(),
    officeLocation: z.string().optional(),
    description: z.string().optional(),
})

export type FormSchema = z.infer<typeof formSchema>;