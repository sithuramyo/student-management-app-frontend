import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { FormSmartSelect } from "@/components/ui/smart-select";
import { useApiMutation } from "@/hooks/useMutation";
import { facultyFormSchema, FacultyFormSchema } from "@/schemas/admins/platformusers/faculties";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const defaultValues: FacultyFormSchema = {
  name: "",
  email: "",
  birthDate: { year: 1990, month: 1, day: 1 },
  gender: 4,
  phoneNumber: "",
  specialization: "",
  status: 4,
  profile: "",
};

interface CreateFacultyRequest {
  loginInfo: {
    email: string;
    password: string;
  };
  facultyInfo: {
    name: string;
    birthDate: Date;
    gender: number;
    phoneNumber: string;
    specialization: string;
    status: number;
    profile: string;
  };
}

export default function Create() {
  const navigate = useNavigate();

  const methods = useForm<FacultyFormSchema>({
    defaultValues,
    resolver: zodResolver(facultyFormSchema),
  });

  const mutation = useApiMutation({
    onSuccess: (res) => {
      toast.success(res.message ?? "Faculty created successfully");
      navigate("/admin/faculty");
    },
  });

  const onSubmit = (data: FacultyFormSchema) => {
    const { year, month, day } = data.birthDate;
    const formattedBirthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const gender = Number(data.gender);
    const status = Number(data.status);
    const request: CreateFacultyRequest = {
      loginInfo: {
        email: data.email,
        password: "Changeme123!",
      },
      facultyInfo: {
        name: data.name,
        birthDate: formattedBirthDate as unknown as Date,
        gender: gender,
        phoneNumber: data.phoneNumber,
        specialization: data.specialization,
        status: status,
        profile: data.profile,
      },
    };

    mutation.mutate({
      endpoint: "/faculty",
      method: "POST",
      body: {
        request: request,
      },
    });
  };
  return (
    <section className="py-6 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormSmartSelect
                  name="gender"
                  placeholder="Select Gender"
                  control={methods.control}
                  label="Gender"
                  options={[
                    { label: "Male", value: 0 },
                    { label: "Female", value: 1 },
                    { label: "Other", value: 2 },
                  ]}
                />

                <FormSmartSelect
                  name="status"
                  placeholder="Select Status"
                  control={methods.control}
                  label="Status"
                  options={[
                    { label: "Active", value: 0 },
                    { label: "OnLeave", value: 1 },
                    { label: "Retired", value: 2 },
                  ]}
                />

                <FormField
                  name="phoneNumber"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="09-xxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="specialization"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Birth Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  name="birthDate.year"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="birthDate.month"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Month</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="birthDate.day"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Profile */}
              <FormField
                name="profile"
                control={methods.control}
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </FormProvider>
        </CardContent>
      </Card>
    </section>
  )
}
