import { useApiQuery } from "@/hooks/useQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useMutation";
import { FormSchema, formSchema } from "@/schemas/academics/departments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";


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
    })

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
        }
    });

    const onSubmit = (data: FormSchema) => {
        const request: DepartmentRequest = {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email,
            officeLocation: data.officeLocation,
            description: data.description
        }

        mutation.mutate({
            endpoint: `/department/${id}`,
            method: "PUT",
            body: {
                request: request,
            },
        });
    }
    return (
        <section className="py-2">
            <Card className="flex justify-center">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter name"
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
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter phone number"
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter email"
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
                                name="officeLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Office Location</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter office location"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter description"
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end mt-4">
                                <Button
                                    variant="outline"
                                    type="submit"
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
                </CardContent>
            </Card>
        </section>
    )
}
