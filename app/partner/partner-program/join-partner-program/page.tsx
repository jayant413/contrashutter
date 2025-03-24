"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { apiEndpoint } from "@/helper/api";
import Store from "@/helper/store";
import { toast } from "sonner";

// Define schema for form data using zod
const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  registrationNumber: z.string().nonempty("Registration Number is required"),
  contactPerson: z.string().nonempty("Contact Person is required"),
  contactNumber: z.string().nonempty("Contact Number is required"),
  email: z.string().email("Invalid email address"),
  businessAddress: z.string().nonempty("Business Address is required"),
  employees: z.string().nonempty("Number of Employees is required"),
  experience: z.string().nonempty("Work Experience is required"),
  projects: z.string().nonempty("Significant Projects are required"),
  bankName: z.string().nonempty("Bank Name is required"),
  accountNumber: z.string().nonempty("Account Number is required"),
  ifsc: z.string().nonempty("IFSC Code is required"),
});

export default function ServicePartnerAgreement() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, checkLogin } = Store.useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe",
      registrationNumber: "REG123456",
      contactPerson: "Jane Smith",
      contactNumber: "9876543210",
      email: "johndoe@example.com",
      businessAddress: "123 Business St, Cityville",
      employees: "50",
      experience: "5 years",
      projects: "Project A, Project B",
      bankName: "Example Bank",
      accountNumber: "123456789012",
      ifsc: "EXAM1234567",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await axios.post(`${apiEndpoint}/service-partners/${user?._id}`, data, {
        withCredentials: true,
      });

      toast.success("Request sent successfully, please wait for approval.");
      checkLogin();
      router.push("/partner/partner-program"); // Redirect after successful submission
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 shadow-lg rounded-xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Contrashutter Service Partner Program Agreement
      </h1>
      <p className="text-gray-600 text-center">
        This agreement is entered into between Contrashutter Private Limited and
        the Service Partner.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Service Partner Details */}
          <div>
            <h2 className="text-xl font-semibold">Service Partner Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Individual/Business</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Registration Number / PAN / GST
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Registration Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contact Person" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contact Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Business Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Workforce and Infrastructure */}
          <div>
            <h2 className="text-xl font-semibold">
              Workforce and Infrastructure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Employees" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience (Years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="Experience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Significant Projects Completed</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Projects"
                        className="h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Banking Details */}
          <div>
            <h2 className="text-xl font-semibold">
              Banking Details (For Profit Sharing)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bank Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Account Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="IFSC Code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Terms and Conditions Scrollable Box */}
          <div>
            <h2 className="text-xl font-semibold">Terms and Conditions</h2>
            <div className="border p-4 h-30 overflow-y-scroll bg-gray-100 rounded-md text-sm flex flex-col ">
              <strong>1. Scope of Work</strong>
              <strong>2. Exclusivity and Non-Compete</strong>
              <strong>3. Confidentiality</strong>
              <strong>4. Profit Sharing and Payment</strong>
              <strong>5. Service Quality</strong>
              <Link
                href="/partner/partner-program/join-partner-program/terms-conditions"
                className="w-fit text-blue-500 hover:underline"
              >
                Show more...
              </Link>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              id="terms"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(!!checked)}
            />
            <Label htmlFor="terms">I agree to the terms and conditions</Label>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center gap-4">
            <Button type="submit" disabled={!isChecked || loading}>
              {loading ? "Submitting..." : "Agree & Proceed"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
