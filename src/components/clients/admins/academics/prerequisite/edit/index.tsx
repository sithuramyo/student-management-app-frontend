import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/ui/loading-button";
import { useApiMutation } from "@/hooks/useMutation";
import { FormSmartSelect } from "@/components/ui/smart-select";
import { useCourseOptions } from "@/hooks/admins/common";
import { useApiQuery } from "@/hooks/useQuery";
import { formSchema, FormSchema } from "@/schemas/admins/academics/prerequisites";


export default function Edit({ id }: EditProps) {
    const navigate = useNavigate();
    const { data: courses } = useCourseOptions();

    const courseOptions =
        courses?.courses?.map((p) => ({
            label: p.code,
            value: p.code,
        })) || [];

    const { data: prerequisite } = useApiQuery<undefined, FormSchema>({
        endpoint: `/prerequisite/${id}`,
        queryKey: ["prerequisite", id],
    });

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requiredCourseCode: "",
            requiredMinimumGrade: "",
            isMandatory: false,
            notes: ""
        },
    });

    useEffect(() => {
        if (prerequisite) {
            form.reset(prerequisite);
        }
    }, [prerequisite]);

    const mutation = useApiMutation<FormSchema, NoResponse>({
        onSuccess: (res) => {
            toast.success(res.message);
            navigate("/admin/prerequisite");
        },
    });

    const onSubmit = (data: FormSchema) => {
        mutation.mutate({
            endpoint: `/prerequisite/${id}`,
            method: "PUT",
            body: { request: data },
        });
    };

    return (
        <section className="py-4 px-2">
            <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormSmartSelect
                                control={form.control}
                                name="requiredCourseCode"
                                label="Required Course"
                                placeholder="Select required course"
                                options={courseOptions}
                            />

                            <FormField
                                control={form.control}
                                name="requiredMinimumGrade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Required Minimum Grade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., B+" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isMandatory"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(val) => field.onChange(!!val)}
                                            />
                                        </FormControl>
                                        <FormLabel className="m-0">Is Mandatory?</FormLabel>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Any additional notes (optional)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
