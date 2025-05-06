import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Button } from "@/components/ui/button";
  import { ChevronDown } from "lucide-react";
  import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
  import { useMemo } from "react";
  import { cn } from "@/lib/utils";
  
  type Option = {
    label: string;
    value: string | number;
  };
  
  interface FormSmartSelectProps<T extends FieldValues> {
    name: keyof T;
    control: any;
    label?: string;
    placeholder?: string;
    options: Option[];
    isMulti?: boolean;
    disabled?: boolean;
    onChange?: (value: string | string[]) => void; // ✅ External change handler
  }
  
  export function FormSmartSelect<T extends FieldValues>({
    name,
    control,
    label,
    placeholder = "Select an option",
    options,
    isMulti = false,
    disabled,
    onChange, // ✅ Extract it here
  }: FormSmartSelectProps<T>) {
    return (
      <FormField
        control={control}
        name={name as Path<T>}
        render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => {
          const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];
  
          if (!isMulti) {
            // Single select
            return (
              <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <Select
                    disabled={disabled}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onChange?.(val); // ✅ Fire external onChange
                    }}
                    value={
                      field.value !== undefined && field.value !== null
                        ? field.value.toString()
                        : ""
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }
  
          // Multi-select
          const displayText = useMemo(() => {
            if (!selectedValues.length) return placeholder;
            return options
              .filter((opt) => selectedValues.includes(opt.value.toString()))
              .map((opt) => opt.label)
              .join(", ");
          }, [selectedValues, options, placeholder]);
  
          const toggleValue = (val: string) => {
            const exists = selectedValues.includes(val);
            const updated = exists
              ? selectedValues.filter((v: string) => v !== val)
              : [...selectedValues, val];
            field.onChange(updated);
            onChange?.(updated); // ✅ Fire external onChange for multi-select
          };
  
          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between",
                        !selectedValues.length && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      {displayText}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-h-60 overflow-y-auto p-2">
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 p-1 hover:bg-accent/50 rounded-md"
                        onClick={() => toggleValue(option.value.toString())}
                      >
                        <Checkbox
                          id={option.value.toString()}
                          checked={selectedValues.includes(option.value.toString())}
                          onCheckedChange={() => toggleValue(option.value.toString())}
                        />
                        <label
                          htmlFor={option.value.toString()}
                          className="text-sm font-normal leading-none"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }
  