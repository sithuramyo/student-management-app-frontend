import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { useApiMutation } from "@/hooks/useMutation";
import { useApiQuery } from "@/hooks/useQuery";
import { formSchema, FormSchema } from "@/schemas/platformusers/systemusers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Edit({ id }: EditProps) {
  const navigate = useNavigate();

  const { data: systemuser, isLoading } = useApiQuery<undefined, FormSchema>({
    endpoint: `/systemuser/${id}`,
    queryKey: ["systemuser", id],
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
      profile: "",
    },
  });

  useEffect(() => {
    if (systemuser) {
      form.reset({
        ...systemuser,
        role: Number(systemuser.role),
      });
    }
  }, [systemuser]);

  const mutation = useApiMutation<FormSchema, NoResponse>({
    onSuccess: (res) => {
      toast.success(res.message);
      navigate("/admin/system-user");
    },
  });

  const onSubmit = (data: FormSchema) => {
    mutation.mutate({
      endpoint: `/systemuser/${id}`,
      method: "PUT",
      body: { request: data },
    });
  };

  return (
    <section className="py-4 px-2">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-muted">Loading user data...</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <select
                            className="form-select w-full border rounded px-3 py-2"
                            required
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          >
                            <option value="" disabled>Select role</option>
                            <option value={0}>SuperAdmin</option>
                            <option value={1}>Admin</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="profile"
                  control={form.control}
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
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <LoadingButton />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
