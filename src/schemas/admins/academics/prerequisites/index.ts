import { z } from "zod";


export const formSchema = z.object({
    requiredCourseCode: z.string().min(1, "Required course code is required"),
    requiredMinimumGrade: z.string().min(1, "Minimum grade is required"),
    isMandatory: z.boolean(),
    notes: z.string().optional(),
});


export type FormSchema = z.infer<typeof formSchema>;