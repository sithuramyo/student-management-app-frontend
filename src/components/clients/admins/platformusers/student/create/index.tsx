import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentFormSchema, guardianFormSchema } from "@/schemas/platformusers/students";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useMutation";
import { Card, CardContent } from "@/components/ui/card";
import StudentInfoStep from "../steps/StudentInfoStep";
import GuardianInfoStep from "../steps/GuardianInfoStep";
import { useMultiStepForm } from "@/hooks/admins/useMultiStepForm";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../steps/StepIndicator";
import { AnimatePresence, motion } from "framer-motion";
import LoadingButton from "@/components/ui/loading-button";

const formSchema = z.object({
    studentInfo: studentFormSchema,
    guardianInfo: guardianFormSchema,
});

type FormData = z.infer<typeof formSchema>;

function getStepFields(step: number): string[] {
    switch (step) {
        case 0:
            return [
                "studentInfo.name",
                "studentInfo.email",
                "studentInfo.birthDate.year",
                "studentInfo.birthDate.month",
                "studentInfo.birthDate.day",
                "studentInfo.gender",
                "studentInfo.phoneNumber",
                "studentInfo.address",
                "studentInfo.status",
                "studentInfo.profile",
            ];
        case 1:
            return [
                "guardianInfo.guardianName",
                "guardianInfo.relationship",
                "guardianInfo.contactNumber",
                "guardianInfo.guardianEmail",
                "guardianInfo.guardianAddress",
            ];
        default:
            return [];
    }
}

const defaultValues: FormData = {
    studentInfo: {
        name: "",
        email: "",
        birthDate: { year: 2000, month: 1, day: 1 },
        gender: undefined,
        phoneNumber: "",
        address: "",
        status: undefined,
        profile: "",
    },
    guardianInfo: {
        guardianName: "",
        relationship: "",
        contactNumber: "",
        guardianEmail: "",
        guardianAddress: "",
    },
};

interface CreateStudentRequest {
    loginInfo: {
        email: string;
        password: string;
    };
    studentInfo: {
        name: string;
        birthDate: Date;
        gender: number;
        phoneNumber: string;
        address: string;
        status: number;
        profile: string;
    };
    guardianInfo: {
        name: string;
        relationship: string;
        contactNumber: string;
        email: string;
        address: string;
    };
}

export default function CreateStudentPage() {
    const navigate = useNavigate();

    const methods = useForm<FormData>({
        defaultValues,
        resolver: zodResolver(formSchema),
    });

    const { step, next, back, isFirst, isLast } = useMultiStepForm(2);

    const mutation = useApiMutation({
        onSuccess: (res) => {
            toast.success(res.message ?? "Student created successfully");
            navigate("/admin/student");
        },
    });

    const onSubmit = (data: FormData) => {
        const { year, month, day } = data.studentInfo.birthDate;
        const formattedBirthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const request: CreateStudentRequest = {
            loginInfo: {
                email: data.studentInfo.email,
                password: "Changeme123!",
            },
            studentInfo: {
                name: data.studentInfo.name,
                birthDate: formattedBirthDate as unknown as Date,
                gender: data.studentInfo.gender as number,
                phoneNumber: data.studentInfo.phoneNumber,
                address: data.studentInfo.address,
                status: data.studentInfo.status as number,
                profile: data.studentInfo.profile,
            },
            guardianInfo: {
                name: data.guardianInfo.guardianName,
                relationship: data.guardianInfo.relationship,
                contactNumber: data.guardianInfo.contactNumber,
                email: data.guardianInfo.guardianEmail,
                address: data.guardianInfo.guardianAddress,
            },
        };

        mutation.mutate({
            endpoint: "/student",
            method: "POST",
            body: {
                request: request,
            },
        });
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="py-6 px-2">
                <Card className="max-w-4xl mx-auto">
                    <CardContent className="pt-6">
                        <StepIndicator
                            currentStep={step}
                            steps={[
                                { label: "Student Info" },
                                { label: "Guardian Info" },
                            ]}
                        />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {step === 0 && <StudentInfoStep />}
                                {step === 1 && <GuardianInfoStep />}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between pt-6">
                            {!isFirst && (
                                <Button variant="outline" type="button" onClick={back}>
                                    Back
                                </Button>
                            )}
                            {!isLast ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={async () => {
                                        const isValid = await methods.trigger(getStepFields(step) as any);
                                        if (isValid) next();
                                    }}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button variant="outline" type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? <>
                                        <LoadingButton />
                                        Creating...
                                    </> : "Create"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    );
}
