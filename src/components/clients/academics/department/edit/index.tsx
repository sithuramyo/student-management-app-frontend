import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useApiQuery } from "@/hooks/useQuery";
import { useApiMutation } from "@/hooks/useMutation";
import { FormSchema, formSchema } from "@/schemas/academics/departments";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/loading-button";

interface DepartmentRequest {
  name: string;
  phoneNumber: string | null | undefined;
  email: string | null | undefined;
  officeLocation: string | null | undefined;
  description: string | null | undefined;
}

export default function Edit({ id }: EditProps) {
  const navigate = useNavigate();

  const { data } = useApiQuery({
    endpoint: `/department/${id}`,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        phoneNumber: data.phoneNumber ?? "",
        email: data.email ?? "",
        officeLocation: data.officeLocation ?? "",
        description: data.description ?? "",
      });
    }
  }, [data, form]);

  const mutation = useApiMutation<DepartmentRequest, NoResponse>({
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/admin/department");
    },
  });

  const onSubmit = (data: FormSchema) => {
    mutation.mutate({
      endpoint: `/department/${id}`,
      method: "PUT",
      body: {
        request: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          officeLocation: data.officeLocation,
          description: data.description,
        },
      },
    });
  };

  return (
    <section className="py-4 px-2">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* 🔹 Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter department name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 🔹 Email & Office */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="officeLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Location</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter office address or room"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 🔹 Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter department description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔹 Submit */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  type="submit"
                  disabled={mutation.isPending}
                >
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
  );
}
