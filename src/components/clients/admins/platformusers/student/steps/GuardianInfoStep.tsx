import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function GuardianInfoStep() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="guardianInfo.guardianName"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Guardian Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter guardian's name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="guardianInfo.relationship"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relationship</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Father, Mother, Uncle" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="guardianInfo.contactNumber"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input placeholder="09-xxxxxxxxx" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="guardianInfo.guardianEmail"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="guardian@mail.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="guardianInfo.guardianAddress"
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
    </div>
  );
}
