import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { FormSmartSelect } from "@/components/ui/smart-select";
import { Textarea } from "@/components/ui/textarea";
import { useDepartmentOptions, usePrerequisiteOptions } from "@/hooks/admins/common";
import { useApiMutation } from "@/hooks/useMutation";
import { formSchema, FormSchema } from "@/schemas/academics/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CourseRequest {
  prerequisiteIds: string[] | null | undefined;
  profile: string | null | undefined;
  departmentId: string | null | undefined;
  code: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  creditHours: number;
  semesterOffered: string | null | undefined;
  maxEnrollment: number;
  syllabusUrl: string | null | undefined;
  deliveryMode: string | null | undefined;
}

export default function Create() {
  const navigate = useNavigate();

  const { data: prerequisites } = usePrerequisiteOptions();
  const { data: departments } = useDepartmentOptions();

  const prerequisiteOptions = prerequisites?.prerequisites?.map((p: { requiredCourseCode: string; id: string; }) => ({
    label: p.requiredCourseCode,
    value: p.id,
  })) || [];

  const departmentOptions = departments?.departments?.map((p: { name: string; id: string; }) => ({
    label: p.name,
    value: p.id,
  })) || [];

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })

  const mutation = useApiMutation<CourseRequest, NoResponse>({
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/admin/course");
    }
  });
  const onSubmit = (data: FormSchema) => {
    const request: CourseRequest = {
      prerequisiteIds: data.prerequisiteIds || null,
      profile: data.profile || null,
      departmentId: data.departmentId || null,
      code: data.code || null,
      title: data.title || null,
      description: data.description || null,
      creditHours: data.creditHours,
      semesterOffered: data.semesterOffered || null,
      maxEnrollment: data.maxEnrollment,
      syllabusUrl: data.syllabusUrl || null,
      deliveryMode: data.deliveryMode || null
    }

    mutation.mutate({
      endpoint: "/course",
      method: "POST",
      body: {
        request: request,
      },
    });
  }

  return (
    <section className="py-4 px-2">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* 🔹 Prerequisites (full width) */}
              <FormSmartSelect
                control={form.control}
                name="prerequisiteIds"
                label="Prerequisites"
                placeholder="Select prerequisite courses"
                options={prerequisiteOptions}
                isMulti
              />

              {/* 🔹 Profile, Syllabus URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/profile"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="syllabusUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Syllabus URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/syllabus"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 🔹 Title, Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 🔹 Department, Semester */}
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
                  label="Semester Offered"
                  placeholder="Select semester"
                  options={[
                    { label: "Fall", value: "Fall" },
                    { label: "Spring", value: "Spring" },
                    { label: "Summer", value: "Summer" },
                  ]}
                />
              </div>

              {/* 🔹 Credit & Enrollment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="creditHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Hours</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter credit hours"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxEnrollment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Enrollment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max enrollment"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 🔹 Delivery Mode */}
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

              {/* 🔹 Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter course description"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔹 Submit */}
              <div className="flex justify-end">
                <Button type="submit" variant="outline" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <LoadingButton />
                      Creating...
                    </>
                  ) : (
                    "Create"
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
