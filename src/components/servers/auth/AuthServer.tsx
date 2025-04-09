import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formSchema } from "@/schemas/auth";
import { z } from "zod";
import PasswordInput from "@/components/ui/password-input";
import { useApiMutation } from "@/hooks/useMutation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { useAuthStore } from "@/store/auth"
import { getDecodedToken } from "@/lib/auth";
import LoadingButton from "@/components/ui/loading-button";

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  expiresIn: number
}

export default function AuthServer() {
  const [isView, setIsView] = useState(false);
  const navigate = useNavigate();
  const mutation = useApiMutation<LoginRequest, LoginResponse>({
    onSuccess: (res) => {
      if (res.data) {
        Cookies.set("authToken", res.data.accessToken, {
          expires: res.data.expiresIn,
        });

        const setUser = useAuthStore.getState().setUser;

        const decoded = getDecodedToken(res.data.accessToken);
        setUser(decoded);
        toast.success("Login successful");

        switch (decoded.typ) {
          case "SuperAdmin":
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Student":
            navigate("/student/home");
            break;
          case "Faculty":
            navigate("/faculty/panel");
            break;
          default:
            toast.error("Unauthorized role");
        }
      }
    }

  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: z.infer<typeof formSchema>) => {
    const request: LoginRequest = {
      email: data.email,
      password: data.password
    }
    mutation.mutate({
      endpoint: "/auth",
      method: "POST",
      body: {
        request: request,
      },
    });
  }

  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <PasswordInput
                  placeholder="Password"
                  {...field}
                  isView={isView}
                  toggleView={() => setIsView(!isView)}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              variant="outline"
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <LoadingButton />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
