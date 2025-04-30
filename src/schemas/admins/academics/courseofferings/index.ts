import { z } from "zod";

export const courseOfferingSchema = z.object({
  academicTermId: z.string().min(1, "Academic term is required"),
  courseFacultyInfo: z
    .array(
      z.object({
        courseId: z.string().min(1, "Course is required"),
        facultyId: z.string().min(1, "Faculty is required"),
      })
    )
    .min(1, "At least one course-faculty pair is required"),
});

export type CourseOfferingRequest = z.infer<typeof courseOfferingSchema>;
