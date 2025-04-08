import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "./input";

interface PasswordInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  isView: boolean;
  toggleView: () => void;
}

const PasswordInput = ({
  value,
  placeholder,
  onChange,
  isView,
  toggleView,
}: PasswordInputProps) => (
  <FormItem className="w-full">
    <FormControl className="relative">
      <div>
        <Input
          type={isView ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          onClick={toggleView}
          className="absolute inset-y-0 right-2 hover:bg-inherit flex items-center bg-inherit"
          aria-label={isView ? "Hide password" : "Show password"}
          variant={"ghost"}
        >
          {isView ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeClosed className="w-5 h-5" />
          )}
        </Button>
      </div>
    </FormControl>
    <FormMessage />
  </FormItem>
);

export default PasswordInput;