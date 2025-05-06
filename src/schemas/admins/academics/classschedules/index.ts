import { z } from "zod";

// Time object schema
const timeSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
});

// Course schedule entry
const courseScheduleSchema = z.object({
  courseOfferingId: z.string().min(1, "Course offering ID is required"),
  courseTitle: z.string().min(1, "Course title is required"),
  facultyName: z.string().min(1, "Faculty name is required"),
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  startTime: timeSchema,
  endTime: timeSchema,
  location: z.string().min(1, "Location is required"),
});

// Final form schema
export const formSchema = z.object({
  request: z.object({
    courseSchedules: z.array(courseScheduleSchema).min(1, "At least one schedule is required"),
  }),
});

export type FormSchema = z.infer<typeof formSchema>;
