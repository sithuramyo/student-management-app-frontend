import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingButton from "@/components/ui/loading-button";
import { FormSmartSelect } from "@/components/ui/smart-select";
import {
  CourseOffering,
  CourseOfferingOption,
  useAcademicTermOptions,
  useCourseOfferingOptions,
  useCourseOptions,
  useFacultyOptions,
} from "@/hooks/admins/common";
import { useApiMutation } from "@/hooks/useMutation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CourseScheduleReqeust {
  courseSchedules: CourseSchedulePayload[];
}

// Form-side type
interface CourseScheduleForm {
  courseOfferingId: string;
  courseTitle: string;
  facultyName: string;
  scheduleDate: string;
  dayOfWeek: number;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  location: string;
}

// API payload type
interface CourseSchedulePayload {
  courseOfferingId: string;
  courseTitle: string;
  facultyName: string;
  dayOfWeek: number;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location: string;
}

export default function Create() {
  const navigate = useNavigate();
  const [termId, setTermId] = useState("");

  const { data: academicTerms } = useAcademicTermOptions();
  const { data: courses } = useCourseOptions();
  const { data: faculties } = useFacultyOptions();
  const { data: courseOfferings } = useCourseOfferingOptions(termId);
  const courseOffering = courseOfferings as CourseOfferingOption;
  const courseOptions =
    courses?.courses?.map((c) => ({ label: c.code, value: c.id })) || [];
  const facultyOptions =
    faculties?.faculties?.map((f) => ({ label: f.name, value: f.id })) || [];
  const academicTermOptions =
    academicTerms?.academicTerms?.map((t) => ({ label: t.name, value: t.id })) || [];

  const getCourseName = (id: string) =>
    courseOptions.find((c) => c.value === id)?.label || "Unknown";

  const getFacultyName = (id: string) =>
    facultyOptions.find((f) => f.value === id)?.label || "Unknown";

  const form = useForm<{
    academicTermId: string;
    courseSchedules: CourseScheduleForm[];
  }>({
    defaultValues: {
      academicTermId: "",
      courseSchedules: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "courseSchedules",
  });

  useEffect(() => {
    if (courseOffering?.courseOfferings) {
      const updated = courseOffering.courseOfferings.map((o: CourseOffering) => ({
        courseOfferingId: o.id,
        courseTitle: getCourseName(o.courseId),
        facultyName: getFacultyName(o.facultyId),
        scheduleDate: courseOffering.startDate,
        dayOfWeek: 1,
        startTime: { hour: 9, minute: 0 },
        endTime: { hour: 10, minute: 0 },
        location: "",
      }));
      replace(updated);
    }
  }, [courseOffering]);

  const mutation = useApiMutation<CourseScheduleReqeust, NoResponse>({
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/admin/class-schedule");
    },
  });

  const formatTime = (time: { hour: number; minute: number }) =>
    `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

  const onSubmit = (data: {
    academicTermId: string;
    courseSchedules: CourseScheduleForm[];
  }) => {
    const courseSchedules: CourseSchedulePayload[] = data.courseSchedules.map((item) => ({
      courseOfferingId: item.courseOfferingId,
      courseTitle: item.courseTitle,
      facultyName: item.facultyName,
      scheduleDate: item.scheduleDate,
      dayOfWeek: item.dayOfWeek,
      location: item.location,
      startTime: formatTime(item.startTime),
      endTime: formatTime(item.endTime),
    }));

    const request: CourseScheduleReqeust = {
      courseSchedules: courseSchedules
    }

    mutation.mutate({
      endpoint: "/classschedule",
      method: "POST",
      body: { request: request },
    });
  };

  return (
    <section className="py-4 px-2">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSmartSelect
                name="academicTermId"
                label="Academic Term"
                placeholder="Select Academic Term"
                options={academicTermOptions}
                control={form.control}
                onChange={(value) => {
                  setTermId(value as string);
                }}
              />

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded p-4 space-y-4 bg-muted/30">
                  <div>
                    <label className="text-sm font-medium">Schedule Date</label>
                    <Controller
                      name={`courseSchedules.${index}.scheduleDate`}
                      control={form.control}
                      render={({ field }) => (
                        <input
                          type="date"
                          {...field}
                          className="w-full border rounded px-3 py-2"
                          min={courseOffering.startDate}
                          max={courseOffering.endDate}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Course</label>
                      <input
                        readOnly
                        className="w-full bg-gray-100 border px-3 py-2 rounded"
                        value={field.courseTitle}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Faculty</label>
                      <input
                        readOnly
                        className="w-full bg-gray-100 border px-3 py-2 rounded"
                        value={field.facultyName}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Day of Week</label>
                      <Controller
                        name={`courseSchedules.${index}.dayOfWeek`}
                        control={form.control}
                        render={({ field }) => (
                          <select
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                          >
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                              (day, i) => (
                                <option key={i} value={i}>
                                  {day}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Controller
                        name={`courseSchedules.${index}.location`}
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Room A"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <div className="flex gap-2">
                        <Controller
                          name={`courseSchedules.${index}.startTime.hour`}
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="number"
                              min={0}
                              max={23}
                              {...field}
                              className="w-1/2 border px-2 py-1 rounded"
                              placeholder="Hour"
                            />
                          )}
                        />
                        <Controller
                          name={`courseSchedules.${index}.startTime.minute`}
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="number"
                              min={0}
                              max={59}
                              {...field}
                              className="w-1/2 border px-2 py-1 rounded"
                              placeholder="Minute"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <div className="flex gap-2">
                        <Controller
                          name={`courseSchedules.${index}.endTime.hour`}
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="number"
                              min={0}
                              max={23}
                              {...field}
                              className="w-1/2 border px-2 py-1 rounded"
                              placeholder="Hour"
                            />
                          )}
                        />
                        <Controller
                          name={`courseSchedules.${index}.endTime.minute`}
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="number"
                              min={0}
                              max={59}
                              {...field}
                              className="w-1/2 border px-2 py-1 rounded"
                              placeholder="Minute"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

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
