import { useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { formSchema, FormSchema } from "@/schemas/academics/academicterms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";

export interface AcademicTermRequest {
    name: string;
    profile: string;
    startDate: string;
    endDate: string;
}
export default function Create() {
    const navigate = useNavigate();
    const now = new Date();
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            startDate: {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate(),
            },
            endDate: {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate() + 1,
            },
            profile: "",
        },
    });

    const mutation = useApiMutation<AcademicTermRequest, NoResponse>({
        onSuccess: (res) => {
            toast.success(res.message);
            navigate("/admin/academic-terms");
        },
    });

    const onSubmit = (data: FormSchema) => {
        const { year: startYear, month: startMonth, day: startDay } = data.startDate;
        const { year: endYear, month: endMonth, day: endDay } = data.endDate;
        const formattedStartDate = `${startYear}-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
        const formattedEndDate = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;

        const request: AcademicTermRequest = {
            name: data.name,
            profile: data.profile,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        mutation.mutate({
            endpoint: "/academicterm",
            method: "POST",
            body: { request: request },
        });
    };
    return (
        <section className="py-4 px-2">
            <Card className="max-w-4xl mx-auto">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 2024-2025 Term 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Start Date */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    name="startDate.year"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Year</FormLabel>
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
                                    name="startDate.month"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Month</FormLabel>
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
                                    name="startDate.day"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Day</FormLabel>
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

                            {/* End Date */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    name="endDate.year"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Year</FormLabel>
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
                                    name="endDate.month"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Month</FormLabel>
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
                                    name="endDate.day"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Day</FormLabel>
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

                            {/* Profile Image */}
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
                                            <LoadingButton /> Creating...
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
