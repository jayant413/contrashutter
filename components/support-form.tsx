"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { HelpCircle, Upload, Loader2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.string(),
});

const faqs = [
  {
    question: "How long does it take to receive my photos?",
    answer:
      "Digital photos are typically delivered within 7-14 days after your event, depending on the package you selected. Physical deliverables like albums may take 3-4 weeks for production and delivery.",
  },
  {
    question: "Can I request changes to my edited photos?",
    answer:
      "Yes, most packages include one round of revisions. Please specify the photos you'd like adjusted and the changes you'd like to see.",
  },
  {
    question: "How do I track my physical deliverables?",
    answer:
      "Once your physical items (like albums or prints) are shipped, you'll receive a tracking number in the Deliverables section of your account.",
  },
  {
    question: "What if I need to reschedule my booking?",
    answer:
      "Please contact us at least 48 hours before your scheduled event. Rescheduling fees may apply depending on how close to the event date the change is requested.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit cards, PayPal, and bank transfers. Please check our payment page for more details.",
  },
];

interface SupportFormProps {
  apiEndpoint: string;
}

export default function SupportForm({ apiEndpoint }: SupportFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      message: "",
      priority: "Low",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsPending(true);
    try {
      const response = await axios.post(apiEndpoint, data, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error("Failed to submit support ticket");
      }

      form.reset();
      setFile(null);
      toast.success("Support ticket submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit support ticket. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Support Form */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader className="bg-primaryBlue/5">
              <CardTitle className="text-2xl font-bold">
                Contact Support
              </CardTitle>
              <CardDescription>
                Fill out the form below to get help with your issue
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="subject"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter ticket subject"
                            className="bg-primaryBlue/5 border-primaryBlue/20 focus-visible:ring-primaryOrange/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="priority"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-primaryBlue/5 border-primaryBlue/20 focus:ring-primaryOrange/50">
                              <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="file">Attach Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="border border-dashed border-primaryBlue/20 rounded-lg p-4 text-center cursor-pointer hover:bg-primaryBlue/5 transition-colors">
                          <input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="file"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="h-6 w-6 text-primaryBlue mb-2" />
                            <span className="text-sm font-medium">
                              {file ? file.name : "Click to upload an image"}
                            </span>
                            {!file && (
                              <span className="text-xs text-gray-500 mt-1">
                                PNG, JPG or JPEG (max. 5MB)
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                      {file && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  <FormField
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your issue in detail..."
                            className="min-h-[150px] bg-primaryBlue/5 border-primaryBlue/20 focus-visible:ring-primaryOrange/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primaryOrange hover:bg-primaryOrange/90"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Support Request"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        {/* FAQs */}

        <Card>
          <CardHeader className="bg-primaryBlue/5">
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primaryOrange" />
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}

        <Card className="md:col-span-2">
          <CardHeader className="bg-primaryBlue/5">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Email</p>
                <div className="text-gray-600 dark:text-gray-400">
                  <Link href="mailto:contact.us@contrashutter.com">
                    contact.us@contrashutter.com
                  </Link>
                </div>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <div className="text-gray-600 dark:text-gray-400">
                  <Link href="tel:+919699008025">+91 9699008025</Link>
                </div>
              </div>
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Monday - Friday: 9AM - 6PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Team Image */}
        <div className="relative  rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Support team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/80 to-primaryBlue/30 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h3 className="text-xl font-bold mb-2">
                We&apos;re Here to Help
              </h3>
              <p>
                Our support team is ready to assist you with any questions or
                concerns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
