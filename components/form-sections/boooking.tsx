"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod"; // Import zod for schema validation
// import { BasicInfo } from "./basic-info";
import { FormDetails } from "./form-details";
import { PaymentDetails } from "./payment-details";
import { EventDetails } from "./event-details";
import { DeliveryAddress } from "./delivery-address";
import { apiEndpoint } from "@/helper/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import SectionTitle from "../custom/SectionTitle";
import { RazorpayOrderIdType } from "@/types";
import Store from "@/helper/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, CircleX } from "lucide-react"; // For the checkmark icon

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
    preferredPaymentMethod: "Credit Card",
    paymentType: "1",
    agreeToTerms: true,
    confirmBookingDetails: true,
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

  // const validateBasicInfo = () => {
  //   const basicInfo = form.getValues("basic_info");
  //   return (
  //     basicInfo.fullName &&
  //     basicInfo.gender &&
  //     basicInfo.email &&
  //     basicInfo.phoneNumber &&
  //     basicInfo.addressLine1 &&
  //     basicInfo.city &&
  //     basicInfo.state &&
  //     basicInfo.pincode
  //   );
  // };

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
      // case 0:
      //   if (!validateBasicInfo()) {
      //     toast.error("Please fill all the required fields in Basic Info");
      //     return false;
      //   }
      //   break;
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
    // <BasicInfo key="basic-info" form={form} />,
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
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-[3em]"
        >
          <SectionTitle title={`Step ${currentStep + 1} of ${steps.length}`} />

          <div className="min-h-[55vh]">{steps[currentStep]}</div>
          {currentStep === steps.length - 1 && (
            <div className="flex justify-end">
              <Button type="submit" disabled={paying}>
                {paying ? "Paying..." : "Pay Now"}
              </Button>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep <= 0}
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </Form>

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
    </>
  );
}
