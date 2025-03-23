"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod"; // Import zod for schema validation
import { BasicInfo } from "./basic-info";
import { FormDetails } from "./form-details";
import { PaymentDetails } from "./payment-details";
import { EventDetails } from "./event-details";
import { DeliveryAddress } from "./delivery-address";
import { apiEndpoint } from "@/helper/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import SectionTitle from "../custom/SectionTitle";
import { RazorpayOrderIdType } from "@/types";
import Store from "@/helper/store";

// Define Zod schema for form validation
const BookingSchema = z.object({
  basic_info: z.object({
    fullName: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    alternatePhoneNumber: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }),
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
  basic_info: {
    fullName: "John Doe",
    gender: "Not Specified",
    email: "example@example.com",
    phoneNumber: "1234567890",
    alternatePhoneNumber: "0987654321",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Sample City",
    state: "Sample State",
    pincode: "123456",
  },
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
    const installmentAmount = Math.ceil(totalPrice / installmentType);

    const payload = {
      ...values,
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
            amount: installmentAmount * 100, // Convert to paisa
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
          handler: async function (response: RazorpayOrderIdType) {
            try {
              const verifyResponse = await axios.post(
                `${apiEndpoint}/payment/verify`,
                response
              );

              if (verifyResponse.status === 200) {
                // Add Razorpay details to payload
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

                toast.success("Payment Done Successfully");
                checkLogin();
                router.push("/");
                setActiveService(null);
                form.reset();
              } else {
                toast.error("Payment Failed");
              }
            } catch (error) {
              toast.error("Payment Failed");
              console.error(error);
            }
          },
          prefill: {
            name: values.basic_info.fullName || user.fullname,
            email: values.basic_info.email || user.email,
            contact: values.basic_info.phoneNumber || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error("Something went wrong, Please try again later");
        console.error("Error submitting form:", error);
      }
    });
  }

  const [currentStep, setCurrentStep] = useState(0);

  const validateBasicInfo = () => {
    const basicInfo = form.getValues("basic_info");
    return (
      basicInfo.fullName &&
      basicInfo.gender &&
      basicInfo.email &&
      basicInfo.phoneNumber &&
      basicInfo.addressLine1 &&
      basicInfo.city &&
      basicInfo.state &&
      basicInfo.pincode
    );
  };

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
        if (!validateBasicInfo()) {
          toast.error("Please fill all the required fields in Basic Info");
          return false;
        }
        break;
      case 1:
        if (!validateFormDetails()) {
          toast.error("Please fill all the form fields");
          return false;
        }
        break;
      case 2:
        if (!validateEventDetails()) {
          toast.error("Please fill all the required fields in Event Details");
          return false;
        }
        break;
      case 3:
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
    <BasicInfo key="basic-info" form={form} />,
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
  );
}
