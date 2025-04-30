import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { Separator } from "@/components/ui/separator";
import { FormSmartSelect } from "@/components/ui/smart-select";
import { useAcademicTermOptions, useCourseOptions, useFacultyOptions } from "@/hooks/admins/common";
import { useApiMutation } from "@/hooks/useMutation";
import { courseOfferingSchema } from "@/schemas/admins/academics/courseofferings";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface CourseOfferingRequest {
    academicTermId: string;
    courseFacultyInfo: CourseFacultyInfo[];
}

interface CourseFacultyInfo {
    courseId: string;
    facultyId: string;
}

export default function CreateCourseOffering() {
    const navigate = useNavigate();

    // Fetch options
    const { data: courses } = useCourseOptions();
    const courseOptions =
        courses?.courses?.map((p: { code: string; id: string }) => ({
            label: p.code,
            value: p.id,
        })) || [];

    const { data: faculties } = useFacultyOptions();
    const facultyOptions =
        faculties?.faculties?.map((p: { name: string; id: string }) => ({
            label: p.name,
            value: p.id,
        })) || [];

    const { data: academicTerms } = useAcademicTermOptions();
    const academicTermOptions =
        academicTerms?.academicTerms?.map((p: { name: string; id: string }) => ({
            label: p.name,
            value: p.id,
        })) || [];

    // Mutation
    const mutation = useApiMutation<CourseOfferingRequest, NoResponse>({
        onSuccess: (res) => {
            toast.success(res.message);
            navigate("/admin/course-offering");
        },
    });

    // Form setup
    const form = useForm<CourseOfferingRequest>({
        resolver: zodResolver(courseOfferingSchema),
        defaultValues: {
            academicTermId: "",
            courseFacultyInfo: [{ courseId: "", facultyId: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "courseFacultyInfo",
    });

    const onSubmit = (data: CourseOfferingRequest) => {
        mutation.mutate({
            endpoint: "/courseoffering",
            method: "POST",
            body: { request: data },
        });
    };

    return (
        <section className="py-4 px-2">
            <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Academic Term */}
                            <FormSmartSelect
                                name="academicTermId"
                                label="Academic Term"
                                placeholder="Select Academic Term"
                                options={academicTermOptions}
                                control={form.control} />

                            <Separator />

                            {/* Dynamic Course-Faculty Pairs */}
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-4 sm:flex-row sm:items-end"
                                    >
                                        <div className="flex flex-col flex-1">
                                            <div className="text-xs font-medium text-gray-600 mb-1">
                                                Course #{index + 1}
                                            </div>
                                            <FormSmartSelect
                                                name={`courseFacultyInfo.${index}.courseId`}
                                                placeholder="Select course"
                                                label="Course"
                                                options={courseOptions}
                                                control={form.control}
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className="text-xs font-medium text-gray-600 mb-1">
                                                Faculty #{index + 1}
                                            </div>
                                            <FormSmartSelect
                                                name={`courseFacultyInfo.${index}.facultyId`}
                                                placeholder="Select faculty"
                                                label="Faculty"
                                                options={facultyOptions}
                                                control={form.control}
                                            />
                                        </div>

                                        <div className="mt-2 sm:mt-0">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full sm:w-auto"
                                                onClick={() => remove(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Course Button */}
                            <div className="flex justify-start">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-sm"
                                    onClick={() => append({ courseId: "", facultyId: "" })}
                                >
                                    + Add Another Course
                                </Button>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? (
                                        <>
                                            <LoadingButton /> Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>

                </CardContent>
            </Card>
        </section>
    );
}
