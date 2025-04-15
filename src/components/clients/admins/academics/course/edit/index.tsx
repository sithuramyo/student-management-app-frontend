import { useApiQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { FormSmartSelect } from "@/components/ui/smart-select";
import { Textarea } from "@/components/ui/textarea";
import { useDepartmentOptions, usePrerequisiteOptions } from "@/hooks/admins/common";
import { useApiMutation } from "@/hooks/useMutation";
import { formSchema, FormSchema } from "@/schemas/admins/academics/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";


export default function Edit({ id }: EditProps) {
    const navigate = useNavigate();
    const { data: prerequisites } = usePrerequisiteOptions();
    const { data: departments } = useDepartmentOptions();
    const { data: course } = useApiQuery<undefined, FormSchema>({
        endpoint: `/course/${id}`,
        queryKey: ["course", id],
    });

    const prerequisiteOptions = prerequisites?.prerequisites?.map((p) => ({
        label: p.requiredCourseCode,
        value: p.id,
    })) ?? [];

    const departmentOptions = departments?.departments?.map((d) => ({
        label: d.name,
        value: d.id,
    })) ?? [];

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: course, // Will be reset once data is loaded
    });

    useEffect(() => {
        if (course) {
            form.reset({
                ...course,
                prerequisiteIds: course.prerequisiteIds ?? [],
                departmentId: course.departmentId ?? "",
                semesterOffered: course.semesterOffered ?? "",
                deliveryMode: course.deliveryMode ?? ""
            });
        }
    }, [course]);


    const mutation = useApiMutation<FormSchema, NoResponse>({
        onSuccess: (res) => {
            toast.success(res.message);
            navigate("/admin/course");
        }
    });

    const onSubmit = (data: FormSchema) => {
        mutation.mutate({
            endpoint: `/course/${id}`,
            method: "PUT",
            body: { request: data },
        });
    };
    return (
        <section className="py-4 px-2">
            <Card className="max-w-5xl mx-auto">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Prerequisites */}
                            <FormSmartSelect
                                control={form.control}
                                name="prerequisiteIds"
                                label="Prerequisites"
                                placeholder="Select prerequisite courses"
                                options={prerequisiteOptions}
                                isMulti
                            />

                            {/* Profile and Syllabus */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="profile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile URL</FormLabel>
                                        <FormControl><Input type="url" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="syllabusUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Syllabus URL</FormLabel>
                                        <FormControl><Input type="url" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Title and Code */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="code" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Department and Semester */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSmartSelect
                                    control={form.control}
                                    name="departmentId"
                                    label="Department"
                                    placeholder="Select department"
                                    options={departmentOptions}
                                />
                                <FormSmartSelect
                                    control={form.control}
                                    name="semesterOffered"
                                    label="Semester"
                                    placeholder="Select semester"
                                    options={[
                                        { label: "Fall", value: "Fall" },
                                        { label: "Spring", value: "Spring" },
                                        { label: "Summer", value: "Summer" }
                                    ]}
                                />
                            </div>

                            {/* Credit & Enrollment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="creditHours" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Credit Hours</FormLabel>
                                        <FormControl>
                                            <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="maxEnrollment" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Enrollment</FormLabel>
                                        <FormControl>
                                            <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Delivery Mode */}
                            <FormSmartSelect
                                control={form.control}
                                name="deliveryMode"
                                label="Delivery Mode"
                                placeholder="Select delivery mode"
                                options={[
                                    { label: "Online", value: "Online" },
                                    { label: "Offline", value: "Offline" },
                                    { label: "Hybrid", value: "Hybrid" },
                                ]}
                            />

                            {/* Description */}
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Submit */}
                            <div className="flex justify-end">
                                <Button type="submit" variant="outline" disabled={mutation.isPending}>
                                    {mutation.isPending ? (
                                        <>
                                            <LoadingButton /> Updating...
                                        </>
                                    ) : (
                                        "Update"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    )
}
