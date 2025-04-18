"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      name: "ABC Enterprises",
      registrationNumber: "REG123456",
      contactPerson: "John Doe",
      contactNumber: "9876543210",
      email: user?.email || "abc@example.com",
      businessAddress: "123, Business Street, City, Country",
      employees: "10",
      experience: "5 years",
      projects: "12",
      bankName: "HDFC Bank",
      accountNumber: "123456789012",
      ifsc: "HDFC0001234",
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-primaryBlue hover:text-blue-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Partner Program
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl font-bold">
            Contrashutter Service Partner Program Agreement
          </CardTitle>
          <CardDescription>
            This agreement is entered into between Contrashutter Private Limited
            and the Service Partner.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Service Partner Details */}
              <div>
                <h2 className="text-xl font-bold text-primaryBlue mb-4">
                  Service Partner Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <Separator />

              {/* Workforce and Infrastructure */}
              <div>
                <h2 className="text-xl font-bold text-primaryBlue mb-4">
                  Workforce and Infrastructure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="employees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Employees" />
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
                          <Input {...field} placeholder="Experience" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projects"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Significant Projects Completed</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Projects"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Banking Details */}
              <div>
                <h2 className="text-xl font-bold text-primaryBlue  mb-4">
                  Banking Details (For Profit Sharing)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <Separator />

              {/* Terms and Conditions */}
              <div>
                <h2 className="text-xl font-bold text-primaryBlue mb-4">
                  Terms and Conditions
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>
                      <strong>Scope of Work:</strong> The Service Partner agrees
                      to provide photography, makeup, or decoration services as
                      per the requirements specified by Contrashutter.
                    </li>
                    <li>
                      <strong>Exclusivity and Non-Compete:</strong> The Service
                      Partner agrees not to offer similar services to direct
                      competitors of Contrashutter during the term of this
                      agreement.
                    </li>
                    <li>
                      <strong>Confidentiality:</strong> The Service Partner
                      agrees to maintain the confidentiality of all information
                      shared by Contrashutter.
                    </li>
                    <li>
                      <strong>Profit Sharing and Payment:</strong> Contrashutter
                      will share profits with the Service Partner as per the
                      agreed-upon percentage for each service provided.
                    </li>
                    <li>
                      <strong>Service Quality:</strong> The Service Partner
                      agrees to maintain the highest standards of service
                      quality as specified by Contrashutter.
                    </li>
                  </ol>
                  <div className="mt-2">
                    <Link
                      href="/partner/partner-program/join-partner-program/terms-conditions"
                      className="text-primaryBlue hover:underline text-sm font-medium"
                    >
                      View full terms and conditions
                    </Link>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={isChecked}
                    onCheckedChange={(checked) => setIsChecked(!!checked)}
                    className="text-primaryBlue border-blue-300"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isChecked || loading}
                  className="bg-primaryOrange hover:bg-primaryOrange/80"
                >
                  {loading ? "Submitting..." : "Agree & Proceed"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
