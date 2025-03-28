"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BoxSelectIcon, Eye, EyeOff, Lock, User } from "lucide-react";
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
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Store from "@/helper/store";

const schema = z.object({
  email: z.string().min(1, "Email or number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().nonempty("Role is required"),
});

export default function LoginForm({
  setIsLogin,
}: {
  setIsLogin: (isLogin: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-2xl font-bold text-primaryBlue cursor-default">
          Sign In as <span className="border-b">{form.watch("role")}</span>
        </div>

        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Role</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <BoxSelectIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <Select
                    {...field}
                    defaultValue="Client"
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="pl-10 bg-primaryBlue/5 border-primaryBlue/20 focus:!ring-primaryOrange/50">
                      <SelectValue placeholder="Select Your Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Service Provider">
                        Service Provider
                      </SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Email or Number"
                    className="pl-10 bg-primaryBlue/5 border-primaryBlue/20 focus-visible:ring-primaryOrange/50"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(Number(value)) && value.length < 11) {
                        field.onChange(value);
                      } else if (isNaN(Number(value))) {
                        field.onChange(value);
                      }
                    }}
                  />
                </div>
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-primaryBlue/5 border-primaryBlue/20 focus-visible:ring-primaryOrange/50"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-end">
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              className="text-primaryOrange hover:underline cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </span>
          </p>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primaryOrange hover:bg-primaryOrange/90 text-white"
          >
            {isPending ? "Please wait..." : "Sign In"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
