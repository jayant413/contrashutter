"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { apiEndpoint } from "@/helper/api";
import { isApiError } from "@/types";
import { toast } from "sonner";
import axios from "axios";

const SignupSchema = z
  .object({
    fullname: z.string().min(1, "Full Name is required"),
    contact: z.string().min(1, "Contact is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    role: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // This will show the error on the confirmPassword field
  });

type SignupInputState = z.infer<typeof SignupSchema>;

const Register = () => {
  const form = useForm<SignupInputState>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullname: "",
      contact: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Client", // Default role can be set as needed
    },
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter(); // This will work for app directory

  const SignupSubmitHandler = async (data: z.infer<typeof SignupSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiEndpoint}/auth/register`, data);

      if (response.status == 200) {
        router.push("/login"); // Redirect to login page on success
        toast.success("Registered successfully");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (isApiError(error)) {
        if (error.status == 409) {
          toast.info("Already registered please sign in");
          router.push("/login");
        }
        toast.error(error.response?.data.message || "An error occurred");
      }
      // Handle fetch error here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-[1.5em] bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(SignupSubmitHandler)}
          className=" w-[50em] p-[2em] bg-white rounded-lg shadow-md space-y-6  "
        >
          <div className="text-2xl font-bold text-primaryBlue  cursor-default">
            Sign Up as <span className="border-b ">{form.watch("role")}</span>
          </div>

          <div className="gap-5 grid sm:grid-cols-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Role</FormLabel>
                  <Select
                    {...field}
                    defaultValue=""
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Service Provider">
                        Service Provider
                      </SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" placeholder="Full Name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <Input
                    type="number"
                    placeholder="Contact Number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length < 11) {
                        field.onChange(value);
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-end">
            <p className=" text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-primaryBlue to-primaryBlue hover:opacity-90 text-white "
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
