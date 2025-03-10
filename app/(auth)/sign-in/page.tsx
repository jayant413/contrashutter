"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Store from "@/helper/store";
const schema = z.object({
  email: z.string().min(1, "Email or number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().nonempty("Role is required"),
});

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const { login } = Store.useAuth();
  const router = useRouter();
  const { setActiveService } = Store.useService();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      role: "Client",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      const isLoggedIn = await login(data.email, data.password, data.role);
      if (isLoggedIn) {
        setActiveService(null);
        router.push("/");
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-[2em] bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-2xl font-bold text-primaryBlue  cursor-default">
              Sign In as <span className="border-b ">{form.watch("role")}</span>
            </div>
            <div className="space-y-4">
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Role</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        defaultValue="Client"
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Service Provider">
                            Service Provider
                          </SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Email or Number"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!isNaN(Number(value)) && value.length < 11) {
                            field.onChange(value);
                          } else if (isNaN(Number(value))) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-end">
              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-br from-primaryBlue to-primaryBlue hover:opacity-90 text-white "
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
