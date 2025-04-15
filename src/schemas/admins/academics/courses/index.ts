import { z } from "zod";

export const formSchema = z.object({
    prerequisiteIds: z.array(z.string()).optional(),
    profile: z.string().min(1, "Profile is required"),
    departmentId: z.string().min(1, "Department is required"),
    code: z.string().min(1, "Course code is required"),
    title: z.string().min(1, "Course title is required"),
    description: z.string().min(1, "Description is required"),
    creditHours: z
        .number({ invalid_type_error: "Credit hours must be a number" })
        .min(1, "Minimum 1 credit hour")
        .max(100, "Too many credit hours"),
    semesterOffered: z.string().min(1, "Semester offered is required"),
    maxEnrollment: z
        .number({ invalid_type_error: "Max enrollment must be a number" })
        .min(1, "Must allow at least 1 student")
        .max(2147483647, "Value too high"),
    syllabusUrl: z.string().url("Syllabus URL must be valid"),
    deliveryMode: z.enum(["Online", "Offline", "Hybrid"], {
        errorMap: () => ({ message: "Delivery mode is required" }),
    }),
});

export type FormSchema = z.infer<typeof formSchema>;
