"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod"; // Import zod for schema validation
import { FormDetails } from "./form-details";
import { PaymentDetails } from "./payment-details";
import { EventDetails } from "./event-details";
import { DeliveryAddress } from "./delivery-address";
import { apiEndpoint } from "@/helper/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import Store from "@/helper/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  User,
  CheckCircle2,
  CircleX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RazorpayOrderIdType } from "@/types";

// Define Zod schema for form validation
const BookingSchema = z.object({
  form_details: z.record(z.any()),
  event_details: z.object({
    eventName: z.string().optional(),
    eventDate: z.string().optional(),
    eventStartTime: z.string().optional(),
    eventEndTime: z.string().optional(),
    venueName: z.string().optional(),
    venueAddressLine1: z.string().optional(),
    venueAddressLine2: z.string().optional(),
    venueCity: z.string().optional(),
    venuePincode: z.string().optional(),
    numberOfGuests: z.number().optional(),
    specialRequirements: z.string().optional(),
  }),
  delivery_address: z.object({
    sameAsClientAddress: z.boolean().optional(),
    recipientName: z.string().optional(),
    deliveryAddressLine1: z.string().optional(),
    deliveryAddressLine2: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryState: z.string().optional(),
    deliveryPincode: z.string().optional(),
    deliveryContactNumber: z.string().optional(),
    additionalDeliveryInstructions: z.string().optional(),
  }),
  payment_details: z.object({
    preferredPaymentMethod: z.string().optional(),
    paymentType: z.string(),
    agreeToTerms: z.boolean().optional(),
    confirmBookingDetails: z.boolean().optional(),
  }),
});
const BookingDefaultValues = {
  form_details: {},
  event_details: {
    eventName: "Sample Event",
    eventDate: "2023-10-01",
    eventStartTime: "10:00",
    eventEndTime: "12:00",
    venueName: "Sample Venue",
    venueAddressLine1: "456 Venue Rd",
    venueAddressLine2: "",
    venueCity: "Sample City",
    venuePincode: "654321",
    numberOfGuests: 50,
    specialRequirements: "None",
  },
  delivery_address: {
    sameAsClientAddress: false,
    recipientName: "Jane Doe",
    deliveryAddressLine1: "789 Delivery St",
    deliveryAddressLine2: "",
    deliveryCity: "Delivery City",
    deliveryState: "Delivery State",
    deliveryPincode: "789012",
    deliveryContactNumber: "1122334455",
    additionalDeliveryInstructions: "Leave at the front door",
  },
  payment_details: {
    preferredPaymentMethod: "UPI",
    paymentType: "1",
    agreeToTerms: false,
    confirmBookingDetails: false,
  },
};

export type BookingFormType = z.infer<typeof BookingSchema>;

export function BookingForm() {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false); // New state for failure dialog

  const router = useRouter();
  const [paying, startPayment] = useTransition();

  const { activeEvent } = Store.useEvent();
  const { setActiveService, activeService } = Store.useService();
  const { user, addNotification, checkLogin } = Store.useAuth();
  const { activePackage } = Store.usePackage();

  const form = useForm<BookingFormType>({
    resolver: zodResolver(BookingSchema),
    defaultValues: BookingDefaultValues,
  });

  // Fetch form fields when activeEvent changes
  useEffect(() => {
    const fetchFormFields = async () => {
      if (activeEvent?._id) {
        try {
          const response = await axios.get(
            `${apiEndpoint}/forms/event/${activeEvent._id}`
          );
          if (response.data.data) {
            setFormFields(response.data.data.fields);
            setFormTitle(response.data.data.formTitle);
          }
        } catch (error) {
          setFormFields([]);
          setFormTitle("");
          console.error("Error fetching form fields:", error);
        }
      }
    };

    fetchFormFields();
  }, [activeEvent]);

  async function onSubmit(values: z.infer<typeof BookingSchema>) {
    if (!user) {
      toast.info("Please login to book");
      return;
    } else if (user.role !== "Client") {
      toast.info("Only Client can book packages");
      return;
    }
    if (!activePackage) {
      toast.error("Package not found");
      return;
    }
    const installmentType = Number(values.payment_details.paymentType);
    const totalPrice = activePackage.price;
    const installmentAmount =
      installmentType === 1
        ? totalPrice
        : installmentType === 3
        ? Math.ceil(totalPrice * 0.3)
        : Math.ceil(totalPrice / installmentType);

    const payload = {
      ...values,
      form_details: {
        ...values.form_details,
        title: formTitle,
      },
      package_details: {
        ...activePackage,
        eventName: activeEvent?.eventName,
        serviceName: activeService?.name,
      },
      payment_details: {
        ...values.payment_details,
        paymentType: installmentType,
        paymentMethod: "Razorpay",
        payablePrice: totalPrice,
        paidAmount: installmentAmount,
        dueAmount: totalPrice - installmentAmount,
        paymentDate: new Date(),
      },
    };

    startPayment(async () => {
      try {
        const { data } = await axios.post(
          `${apiEndpoint}/payment/create-order`,
          {
            amount: installmentAmount * 100, // Convert to rupees
            currency: "INR",
            receipt: activePackage._id,
          }
        );

        if (!window.Razorpay) {
          toast.error(
            "Razorpay SDK failed to load. Check your internet connection."
          );
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Contrashutter",
          description: `Payment for Booking (${
            installmentType === 1 ? "Full" : "Installment 1/" + installmentType
          })`,
          order_id: data.id,
          modal: {
            ondismiss: function () {
              // Show failure dialog instead of toast
              setShowFailureDialog(true);
            },
          },
          handler: async function (response: RazorpayOrderIdType) {
            try {
              const verifyResponse = await axios.post(
                `${apiEndpoint}/payment/verify`,
                response
              );

              if (verifyResponse.status === 200) {
                const finalPayload = {
                  ...payload,
                  payment_details: {
                    ...payload.payment_details,
                    razorpayOrderId: data.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                  },
                };

                const bookingResponse = await axios.post(
                  `${apiEndpoint}/bookings`,
                  finalPayload,
                  {
                    withCredentials: true,
                  }
                );

                const notification = {
                  title: `New Booking from ${user.fullname}`,
                  message: `A new booking for package has been made`,
                  redirectPath: `/admin/bookings/${bookingResponse.data._id}`,
                };
                await addNotification([notification]);
                const userNotification = {
                  title: `Booking Confirmation`,
                  message: `Your booking has been confirmed`,
                  redirectPath: `/client/my-bookings/${bookingResponse.data._id}`,
                  receiverId: user._id,
                };
                await addNotification([userNotification]);

                // Show success dialog instead of toast
                setShowSuccessDialog(true);

                // Auto close dialog and redirect after 3 seconds
                setTimeout(() => {
                  setShowSuccessDialog(false);
                  checkLogin();
                  router.push("/");
                  setActiveService(null);
                  form.reset();
                }, 3000);
              } else {
                // Show failure dialog instead of toast
                setShowFailureDialog(true);
              }
            } catch (error) {
              toast.error(
                "Payment Processing Failed. Please try again or contact support.",
                {
                  duration: 5000,
                  description:
                    "If any amount was deducted, it will be refunded within 5-7 working days.",
                }
              );
              console.error(error);
            }
          },
          prefill: {
            name: user.fullname,
            email: user.email,
            contact: user.contact,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              "Failed to initiate payment. Please try again.",
            {
              duration: 5000,
              description:
                "There was an issue connecting to the payment gateway.",
            }
          );
        } else {
          toast.error("Failed to initiate payment. Please try again.");
        }
        console.error("Error creating payment order:", error);
      }
    });
  }

  const [currentStep, setCurrentStep] = useState(0);

  const validateFormDetails = () => {
    const formDetailsValues = form.getValues("form_details");
    return Object.keys(formDetailsValues).length === formFields.length;
  };

  const validateEventDetails = () => {
    const eventDetails = form.getValues("event_details");
    return (
      eventDetails.eventName &&
      eventDetails.eventDate &&
      eventDetails.eventStartTime &&
      eventDetails.eventEndTime &&
      eventDetails.venueName &&
      eventDetails.venueAddressLine1 &&
      eventDetails.venueCity &&
      eventDetails.venuePincode &&
      eventDetails.numberOfGuests
    );
  };

  const validateDeliveryAddress = () => {
    const deliveryAddress = form.getValues("delivery_address");
    if (deliveryAddress.sameAsClientAddress) return true;
    return (
      deliveryAddress.recipientName &&
      deliveryAddress.deliveryAddressLine1 &&
      deliveryAddress.deliveryCity &&
      deliveryAddress.deliveryState &&
      deliveryAddress.deliveryPincode &&
      deliveryAddress.deliveryContactNumber
    );
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!validateFormDetails()) {
          toast.error("Please fill all the form fields");
          return false;
        }
        break;
      case 1:
        if (!validateEventDetails()) {
          toast.error("Please fill all the required fields in Event Details");
          return false;
        }
        break;
      case 2:
        if (!validateDeliveryAddress()) {
          toast.error(
            "Please fill all the required fields in Delivery Address"
          );
          return false;
        }
        break;
    }
    return true;
  };

  const steps = [
    <FormDetails
      key="form-details"
      form={form}
      formFields={formFields}
      formTitle={formTitle}
    />,
    <EventDetails key="event-details" form={form} />,
    <DeliveryAddress key="delivery-address" form={form} />,
    <PaymentDetails key="payment-details" form={form} />,
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Load Razorpay dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, []);

  const stepTitles = ["Basic Info", "Event Info", "Delivery", "Payment"];
  const stepIcons = [
    <User key="user" className="h-5 w-5" />,
    <MapPin key="mappin" className="h-5 w-5" />,
    <Package key="package" className="h-5 w-5" />,
    <CreditCard key="creditcard" className="h-5 w-5" />,
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-primaryBlue/5">
            <CardTitle className="text-2xl font-bold flex justify-between">
              <span>
                {activePackage
                  ? `Book ${activePackage.name || "Package"}`
                  : "Book Package"}
              </span>

              <Button
                variant="ghost"
                className="text-primaryBlue border-b-2 rounded-none hover:border-primaryBlue"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </CardTitle>
            <CardDescription>
              Complete the booking process to secure your package
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {stepTitles.map((title, index) => (
                  <>
                    <div
                      key={`step-${index}`}
                      className={`flex flex-col items-center ${
                        currentStep >= index
                          ? "text-primaryBlue"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          currentStep >= index
                            ? "bg-primaryBlue text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > index ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          stepIcons[index]
                        )}
                      </div>
                      <span className="text-sm">{title}</span>
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div className="flex-1 flex items-center">
                        <div
                          className={`h-1 w-full ${
                            currentStep > index
                              ? "bg-primaryBlue"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="min-h-[55vh]">{steps[currentStep]}</div>

                <div className="flex justify-between mt-8">
                  {currentStep > 0 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      className="bg-primaryBlue hover:bg-primaryBlue/90"
                      onClick={nextStep}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primaryOrange hover:bg-primaryOrange/90"
                      disabled={
                        paying ||
                        !form.getValues("payment_details.agreeToTerms") ||
                        !form.getValues("payment_details.confirmBookingDetails")
                      }
                    >
                      {paying ? "Processing..." : "Complete Booking"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <DialogTitle className="text-xl">Success</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            Your order successfully placed and our representative will connect
            you shortly
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center gap-4">
            <CircleX className="h-12 w-12 text-red-500" />
            <DialogTitle className="text-xl">Failure</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            There was an issue processing your payment. Please try again or
            contact support.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
