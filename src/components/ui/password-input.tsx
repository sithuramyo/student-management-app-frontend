import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "./input";
import * as React from "react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isView: boolean;
  toggleView: () => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ isView, toggleView, className, ...props }, ref) => {
    return (
      <FormItem className="w-full">
        <FormControl className="relative">
          <div>
            <Input
              type={isView ? "text" : "password"}
              ref={ref}
              className={className}
              {...props}
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
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
