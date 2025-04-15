import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
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
import { formSchema, FormSchema } from "@/schemas/academics/prerequisites";
import { useCourseOptions } from "@/hooks/admins/common";
import { FormSmartSelect } from "@/components/ui/smart-select";


export default function Create() {
    const navigate = useNavigate();
    const { data: courses } = useCourseOptions();

    const courseOptions = courses?.courses?.map((p: { code: string; id: string; }) => ({
        label: p.code,
        value: p.code,
    })) || [];

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requiredCourseCode: "",
            requiredMinimumGrade: "",
            isMandatory: false,
            notes: ""
        },
    });

    const mutation = useApiMutation<FormSchema, NoResponse>({
        onSuccess: (res) => {
            toast.success(res.message);
            navigate("/admin/prerequisite");
        },
    });

    const onSubmit = (data: FormSchema) => {
        mutation.mutate({
            endpoint: "/prerequisite",
            method: "POST",
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
                                placeholder="Select required courses"
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
