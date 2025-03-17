"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { apiEndpoint } from "@/helper/api";
import { EventType, ServiceType } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptOnlyNumbers } from "@/helper/commonFunctions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  price: z.string().min(1, "Price is required"),
  booking_price: z.string().min(1, "Booking price is required"),
  serviceId: z.string().min(1, "Service is required"),
  eventId: z.string().min(1, "Event is required"),
  card_details: z.array(
    z.object({
      product_name: z.string(),
      quantity: z.string(),
    })
  ),
  package_details: z.array(
    z.object({
      title: z.string(),
      subtitles: z.array(z.string()),
    })
  ),
  bill_details: z.array(
    z.object({
      type: z.string(),
      amount: z.string(),
    })
  ),
});

const AddPackagePage = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof packageSchema>>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      price: "",
      booking_price: "",
      serviceId: "",
      eventId: "",
      card_details: [{ product_name: "", quantity: "" }],
      package_details: [{ title: "", subtitles: [""] }],
      bill_details: [{ type: "", amount: "" }],
    },
  });

  const { control } = form;

  // Fetch services
  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    getServices();
  }, []);

  // Fetch events when service is selected
  useEffect(() => {
    const serviceId = form.watch("serviceId");
    if (serviceId) {
      const getEvents = async () => {
        try {
          const res = await axios.get(`${apiEndpoint}/services/${serviceId}`);
          setEvents(res.data.events);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      getEvents();
    }
  }, [form.watch("serviceId")]);

  const onSubmit = async (data: z.infer<typeof packageSchema>) => {
    setLoading(true);

    try {
      await axios.post(`${apiEndpoint}/packages`, data);
      toast.success("Package created successfully");
      router.push("/admin/packages");
    } catch (error) {
      console.error("Error creating package:", error);
      toast.error("Error creating package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <SectionTitle title="Add New Package" onClick={() => router.back()} />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-bold mb-4">Add Package</h1>

            {/* Basic Package Info */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter package name" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter price"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (AcceptOnlyNumbers(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="booking_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter booking price"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (AcceptOnlyNumbers(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Service and Event Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Service</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Event</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event._id} value={event._id || ""}>
                            {event.eventName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {/* Card Details Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Card Details</h2>
                <Button
                  type="button"
                  onClick={() => {
                    const currentDetails = form.getValues("card_details") || [];
                    form.setValue("card_details", [
                      ...currentDetails,
                      { product_name: "", quantity: "" },
                    ]);
                  }}
                >
                  Add More
                </Button>
              </div>
              {form.watch("card_details")?.map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`card_details.${index}.product_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Product Name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`card_details.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Quantity" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Package Details Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Package Details</h2>
                <Button
                  type="button"
                  onClick={() => {
                    const currentDetails =
                      form.getValues("package_details") || [];
                    form.setValue("package_details", [
                      ...currentDetails,
                      { title: "", subtitles: [] },
                    ]);
                  }}
                >
                  Add Title
                </Button>
              </div>
              {form.watch("package_details")?.map((detail, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <FormField
                      control={control}
                      name={`package_details.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Title" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const currentDetails =
                          form.getValues("package_details");
                        currentDetails.splice(index, 1);
                        form.setValue("package_details", currentDetails);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  {detail.subtitles?.map((_, subtitleIndex) => (
                    <div key={subtitleIndex} className="flex gap-2 ml-4">
                      <FormField
                        control={control}
                        name={`package_details.${index}.subtitles.${subtitleIndex}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Subtitle" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const currentSubtitles = form.getValues(
                            `package_details.${index}.subtitles`
                          );
                          currentSubtitles.splice(subtitleIndex, 1);
                          form.setValue(
                            `package_details.${index}.subtitles`,
                            currentSubtitles
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    className="ml-4"
                    onClick={() => {
                      const currentSubtitles =
                        form.getValues(`package_details.${index}.subtitles`) ||
                        [];
                      form.setValue(`package_details.${index}.subtitles`, [
                        ...currentSubtitles,
                        "",
                      ]);
                    }}
                  >
                    Add Subtitle
                  </Button>
                </div>
              ))}
            </div>

            {/* Bill Details Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Bill Details</h2>
                <Button
                  type="button"
                  onClick={() => {
                    const currentDetails = form.getValues("bill_details") || [];
                    form.setValue("bill_details", [
                      ...currentDetails,
                      { type: "", amount: "" },
                    ]);
                  }}
                >
                  Add More
                </Button>
              </div>
              {form.watch("bill_details")?.map((bill, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`bill_details.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Type" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`bill_details.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Amount" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Package"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddPackagePage;
