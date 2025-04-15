import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormSmartSelect } from "@/components/ui/smart-select";

export default function StudentInfoStep() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                name="studentInfo.name"
                control={control}
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
                name="studentInfo.email"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="example@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormSmartSelect
                name="studentInfo.gender"
                placeholder="Select Gender"
                label="Gender"
                options={[
                    { label: "Male", value: 0 },
                    { label: "Female", value: 1 },
                    { label: "Other", value: 2 },
                ]} control={control} />

            <FormSmartSelect
                control={control}
                name="studentInfo.status"
                placeholder="Select Status"
                label="Status"
                options={[
                    { label: "Active", value: 1 },
                    { label: "Inactive", value: 2 },
                    { label: "Graduated", value: 3 },
                    { label: "Dropped", value: 4 },
                    { label: "Suspended", value: 5 },
                    { label: "Transferred", value: 6 },
                    { label: "Alumni", value: 7},
                ]}
            />

            <FormField
                name="studentInfo.phoneNumber"
                control={control}
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
                name="studentInfo.birthDate.year"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birth Year</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="2000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="studentInfo.birthDate.month"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birth Month</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1 - 12" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="studentInfo.birthDate.day"
                control={control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birth Day</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1 - 31" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="studentInfo.address"
                control={control}
                render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter address..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="studentInfo.profile"
                control={control}
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
        </div>
    );
}
