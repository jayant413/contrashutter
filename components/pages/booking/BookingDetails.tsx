"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Printer,
  User,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingType, RazorpayOrderIdType, ServicePartnerType } from "@/types";
import { apiEndpoint } from "@/helper/api";
import Store from "@/helper/store";

interface BookingDetailsProps {
  booking: BookingType | null;
  userRole: "Service Provider" | "Client" | "Admin";
  userId?: string;
  partnerId?: string;
  setBooking: (booking: BookingType) => void;
  handleStatusChange?: (newStatus: string) => void;
  getAllServicePartners?: () => void;
  filteredServicePartners?: { active: ServicePartnerType[] };
  checkLogin?: () => void;
}

export default function BookingDetails({
  booking,
  userRole,
  //   userId,
  partnerId,
  setBooking,
  handleStatusChange,
  //   getAllServicePartners,
  filteredServicePartners,
  checkLogin,
}: BookingDetailsProps) {
  const router = useRouter();
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [paying, startPayment] = useTransition();
  const [isPrinting, setIsPrinting] = useState(false);
  const { addNotification, user } = Store.useAuth();

  const statusOptions = [
    "Booked",
    "In Progress",
    "Deliverables Ready",
    "Completed",
    "Cancelled",
  ];

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleBalancePayment = async () => {
    if (!booking) return;

    startPayment(async () => {
      const paymentAmount = booking.payment_details.payablePrice * 0.4;
      try {
        const { data } = await axios.post(
          `${apiEndpoint}/payment/create-order`,
          {
            amount: paymentAmount * 100, // Convert to paisa
            currency: "INR",
            receipt: booking._id,
          }
        );

        if (!window.Razorpay) {
          toast.error("Razorpay SDK failed to load");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Contrashutter",
          description: "Balance Payment for Booking",
          order_id: data.id,
          handler: async function (response: RazorpayOrderIdType) {
            try {
              const verifyResponse = await axios.post(
                `${apiEndpoint}/payment/verify`,
                response
              );

              if (verifyResponse.status === 200) {
                // Update booking with payment details
                const updateResponse = await axios.put(
                  `${apiEndpoint}/bookings/${booking._id}`,
                  {
                    payment_details: {
                      ...booking.payment_details,
                      paidAmount: booking.payment_details.payablePrice * 0.7,
                      dueAmount: booking.payment_details.payablePrice * 0.3,
                      paymentStatus: "Partial",
                      razorpayOrderId: data.id,
                      razorpayPaymentId: response.razorpay_payment_id,
                    },
                  },
                  {
                    withCredentials: true,
                  }
                );
                if (checkLogin) checkLogin();
                setBooking(updateResponse.data.updatedBooking);
                toast.success("Balance payment completed successfully");
              }
            } catch (error) {
              console.error("Error processing payment:", error);
              toast.error("Payment failed");
            }
          },
          prefill: {
            name: user?.fullname,
            email: user?.email,
            contact: user?.contact,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error creating payment order:", error);
        toast.error("Failed to initiate payment");
      }
    });
  };

  const handleProviderAssign = async () => {
    if (!selectedProviderId) {
      toast.info("Please select a service provider");
      return;
    }

    try {
      const response = await axios.put(
        `${apiEndpoint}/bookings/${booking?._id}`,
        {
          servicePartner: selectedProviderId,
          assignedStatus: "Requested",
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Booking updated successfully");
        setBooking(response.data.updatedBooking);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const handlePaymentReminder = async () => {
    if (!booking?.userId?._id || !addNotification) return;

    const notification = {
      title: "Payment Reminder",
      message:
        "Your second installment payment is due. Please complete the payment.",
      redirectPath: `/client/my-bookings/${booking._id}`,
    };

    try {
      const result = await addNotification([notification], booking.userId._id);
      if (result) {
        toast.success("Payment reminder sent successfully");
      }
    } catch (error) {
      console.error("Error sending payment reminder:", error);
      toast.error("Failed to send payment reminder");
    }
  };

  const handlePartnerResponse = async (status: "Accepted" | "Rejected") => {
    if (!booking) return;

    try {
      const response = await axios.put(
        `${apiEndpoint}/bookings/${booking._id}`,
        {
          servicePartner: partnerId,
          assignedStatus: status,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Booking updated successfully");
        setBooking(response.data.updatedBooking);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const getLastPartnerResponse = () => {
    if (!booking?.assignedStatusHistory?.length) return null;
    return booking.assignedStatusHistory[0];
  };

  const lastPartnerResponse = getLastPartnerResponse();
  const showPartnerActionButtons =
    !lastPartnerResponse || lastPartnerResponse.status === "Requested";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-primaryBlue hover:text-primaryOrange"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-primaryBlue text-primaryBlue hover:bg-primaryBlue hover:text-white"
          onClick={() => {
            // Create a new window for printing
            const printWindow = window.open("", "_blank");
            if (!printWindow) return;

            // Update the print content section
            const printContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>Booking #${booking?.booking_no} - Contrashutter</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 30px;
                  }
                  .booking-number {
                    color: #FF5722;
                    font-weight: bold;
                  }
                  .section {
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                  }
                  .section-title {
                    color: #042B3A;
                    font-size: 1.2em;
                    font-weight: bold;
                    margin-bottom: 10px;
                  }
                  .grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                  }
                  .label {
                    font-weight: bold;
                    min-width: 150px;
                    display: inline-block;
                  }
                  @media print {
                    body { padding: 0; }
                    .section { page-break-inside: avoid; }
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Contrashutter</h1>
                  <h2>Booking Number: <span class="booking-number">${
                    booking?.booking_no
                  }</span></h2>
                </div>

                <div class="section">
                  <div class="section-title">Package Details</div>
                  <div class="grid">
                    <div><span class="label">Package Name:</span> ${
                      booking?.package_details?.name || "Not specified"
                    }</div>
                    <div><span class="label">Price:</span> ₹${
                      booking?.package_details?.price?.toLocaleString(
                        "en-IN"
                      ) || "0"
                    }</div>
                    <div><span class="label">Package Inclusions:</span> ${
                      booking?.package_details?.card_details &&
                      booking?.package_details?.card_details?.length > 0
                        ? booking?.package_details?.card_details
                            ?.map(
                              (card) =>
                                `<br>- ${card.product_name} - Quantity: ${card.quantity}`
                            )
                            .join("")
                        : "<br>- Quantity: 0"
                    }</div>
                    <div><span class="label">Bill Breakdown:</span> ${
                      booking?.package_details?.bill_details &&
                      booking.package_details.bill_details.length > 0
                        ? booking.package_details.bill_details
                            .map(
                              (bill) =>
                                `<br>- ${bill.type || ""}: ₹${
                                  bill.amount?.toLocaleString("en-IN") || "0"
                                }`
                            )
                            .join("")
                        : ": ₹0"
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Personal Details</div>
                  <div class="grid">
                    <div><span class="label">Full Name:</span> ${
                      booking?.userId?.fullname || "Not specified"
                    }</div>
                    <div><span class="label">Email:</span> ${
                      booking?.userId?.email || "Not specified"
                    }</div>
                    <div><span class="label">Phone Number:</span> ${
                      booking?.userId?.contact || "Not specified"
                    }</div>
                    <div><span class="label">Address:</span> ${
                      booking?.userId?.address || ""
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Event Details</div>
                  <div class="grid">
                    <div><span class="label">Event Name:</span> ${
                      booking?.eventName || "Not specified"
                    }</div>
                    <div><span class="label">Event Date:</span> ${
                      booking?.event_details?.eventDate
                        ? new Date(
                            booking.event_details.eventDate
                          ).toLocaleDateString()
                        : "Not specified"
                    }</div>
                    <div><span class="label">Venue:</span> ${
                      booking?.event_details?.venueName || ""
                    }, ${booking?.event_details?.venueCity || ""}</div>
                    <div><span class="label">Number of Guests:</span> ${
                      booking?.event_details?.numberOfGuests || "Not specified"
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Delivery Information</div>
                  <div class="grid">
                    <div><span class="label">Recipient Name:</span> ${
                      booking?.delivery_address?.recipientName ||
                      "Not specified"
                    }</div>
                    <div><span class="label">Address:</span> ${
                      booking?.delivery_address?.deliveryAddressLine1 || ""
                    }, ${booking?.delivery_address?.deliveryCity || ""}, ${
              booking?.delivery_address?.deliveryState || ""
            } - ${booking?.delivery_address?.deliveryPincode || ""}</div>
                    <div><span class="label">Contact Number:</span> ${
                      booking?.delivery_address?.deliveryContactNumber ||
                      "Not specified"
                    }</div>
                    <div><span class="label">Additional Instructions:</span> ${
                      booking?.delivery_address
                        ?.additionalDeliveryInstructions || "None"
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Photography Preferences</div>
                  <div class="grid">
                    <div><span class="label">Preferred Style:</span> ${
                      booking?.payment_details?.preferredPhotographyStyle ||
                      "Not specified"
                    }</div>
                    <div><span class="label">Editing Style:</span> ${
                      booking?.payment_details?.preferredEditingStyle ||
                      "Not specified"
                    }</div>
                    <div><span class="label">Reference Files:</span> ${
                      booking?.payment_details?.referenceFiles?.length
                        ? "Uploaded"
                        : "None"
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Payment Information</div>
                  <div class="grid">
                    <div><span class="label">Preferred Method:</span> ${
                      booking?.payment_details?.preferredPaymentMethod ||
                      "Not specified"
                    }</div>
                    <div><span class="label">Payment Type:</span> ${
                      booking?.payment_details?.paymentType || "Not specified"
                    }</div>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Invoice History</div>
                  <div class="grid">
                    ${booking?.invoices
                      ?.map(
                        (invoice, index) => `
                      <div style="margin-top: 10px; padding-top: 10px; border-top: ${
                        index > 0 ? "1px solid #eee" : "none"
                      }">
                        <div><span class="label">Payment Date:</span> ${
                          invoice.paymentDate
                            ? new Date(invoice.paymentDate).toLocaleDateString()
                            : "Not specified"
                        }</div>
                        <div><span class="label">Amount Paid:</span> ₹${
                          invoice.paidAmount?.toLocaleString("en-IN") || "0"
                        }</div>
                        <div><span class="label">Payment Method:</span> ${
                          invoice.paymentMethod || "Not specified"
                        }</div>
                        <div><span class="label">Status:</span> ${
                          invoice.paymentStatus || "Not specified"
                        }</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </body>
              </html>
            `;

            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.onload = () => {
              printWindow.print();
            };
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Booking
        </Button>
        <div className="flexs gap-2 hidden">
          <Button
            onClick={handlePrint}
            className="bg-primaryBlue hover:bg-primaryBlue/90"
            disabled={isPrinting}
          >
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? "Printing..." : "Print Invoice"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-primaryBlue/5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Booking #{booking?.booking_no}
                  </CardTitle>
                  <CardDescription>
                    {booking?.eventName} -{" "}
                    {booking?.event_details?.eventDate
                      ? new Date(
                          booking.event_details.eventDate
                        ).toLocaleDateString()
                      : "Not specified"}
                  </CardDescription>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking?.status === "Booked"
                      ? "bg-green-100 text-green-800"
                      : booking?.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking?.status === "Deliverables Ready"
                      ? "bg-blue-100 text-blue-800"
                      : booking?.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking?.status || "Status Unknown"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Status Update - Admin Only */}
              {userRole === "Admin" && (
                <div className="mb-6 border-b pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-primaryBlue">
                      Booking Status
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Status History</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Booking Timeline</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          {booking?.statusHistory?.map((history, index) => (
                            <div
                              key={index}
                              className="flex items-start mb-4 relative"
                            >
                              {/* Timeline dot */}
                              <div className="w-4 h-4 rounded-full bg-primaryOrange flex-shrink-0 z-10 mt-1" />

                              {/* Vertical connecting line */}
                              {index <
                                (booking?.statusHistory?.length || 0) - 1 && (
                                <div className="absolute top-5 left-[7px] w-[2px] h-[calc(100%+12px)] bg-orange-200" />
                              )}

                              {/* Content */}
                              <div className="ml-4">
                                <div className="font-semibold text-lg">
                                  {history.status}
                                </div>
                                <div className="text-gray-500">
                                  {(() => {
                                    const date = new Date(history.updatedAt);
                                    const day = date.getDate();
                                    const month = date.toLocaleString(
                                      "default",
                                      { month: "short" }
                                    );
                                    const year = date.getFullYear();
                                    const suffix = ["th", "st", "nd", "rd"][
                                      day % 10 > 3
                                        ? 0
                                        : (day % 100) - (day % 10) != 10
                                        ? day % 10
                                        : 0
                                    ];
                                    return `${day}${suffix} ${month} ${year} ${new Date(
                                      history.updatedAt
                                    ).toLocaleTimeString([], {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}`;
                                  })()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Select
                      onValueChange={handleStatusChange}
                      value={booking?.status}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primaryOrange mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-gray-600">
                          {booking?.event_details?.eventDate
                            ? new Date(
                                booking.event_details.eventDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primaryOrange mt-0.5" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-gray-600">
                          {booking?.event_details?.venueName || "Not provided"},{" "}
                          {booking?.event_details?.venueCity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primaryOrange mt-0.5" />
                      <div>
                        <p className="font-medium">Number of Guests</p>
                        <p className="text-gray-600">
                          {booking?.event_details?.numberOfGuests}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {userRole !== "Service Provider" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Client Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primaryOrange mt-0.5" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p className="text-gray-600">{user?.fullname}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primaryOrange mt-0.5" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-gray-600">{user?.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ExternalLink className="h-5 w-5 text-primaryOrange mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Service Provider Section - Admin Only */}
              {userRole === "Admin" && (
                <>
                  {booking?.servicePartner ? (
                    <div className="border-b pb-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-primaryBlue">
                          Service Provider Assigned
                        </h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              View Response History
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Response History</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {booking?.assignedStatusHistory?.map(
                                (history, index) => (
                                  <div key={index} className="border-b pb-2">
                                    <p className="font-semibold">
                                      Status: {history.status}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Date:{" "}
                                      {new Date(
                                        history.updatedAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="text-gray-700 font-medium bg-primaryBlue/5 p-3 rounded">
                        {booking?.servicePartner.name}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 border-b pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-primaryBlue">
                          Assign Service Provider
                        </h3>
                        {booking?.assignedStatusHistory &&
                          booking?.assignedStatusHistory?.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  View Response History
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Response History</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {booking?.assignedStatusHistory?.map(
                                    (history, index) => (
                                      <div
                                        key={index}
                                        className="border-b pb-2"
                                      >
                                        <p className="font-semibold">
                                          Status: {history.status}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Date:{" "}
                                          {new Date(
                                            history.updatedAt
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                      </div>
                      <div className="flex justify-between items-center">
                        <Select
                          onValueChange={(value) =>
                            setSelectedProviderId(value)
                          }
                        >
                          <SelectTrigger className="w-full md:w-2/3">
                            <SelectValue placeholder="Select a Service Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredServicePartners?.active.map((provider) => (
                              <SelectItem
                                key={provider._id}
                                value={provider._id || ""}
                              >
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="bg-primaryBlue hover:bg-primaryBlue/90"
                          onClick={handleProviderAssign}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Partner Response Section */}
              {userRole === "Service Provider" && showPartnerActionButtons && (
                <div className="mb-6 border-b pb-4">
                  <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                    Booking Response
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePartnerResponse("Accepted")}
                    >
                      Accept Booking
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handlePartnerResponse("Rejected")}
                    >
                      Reject Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* Partner Response Status - When already responded */}
              {userRole === "Service Provider" &&
                !showPartnerActionButtons &&
                lastPartnerResponse && (
                  <div className="mb-6 border-b pb-4">
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Your Response
                    </h3>
                    <div
                      className={`text-center p-3 rounded-md font-medium ${
                        lastPartnerResponse.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      You have {lastPartnerResponse.status} this booking
                    </div>
                  </div>
                )}

              <div>
                <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                  Package Details
                </h3>
                <div className="bg-primaryBlue/5 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Package Name</h4>
                  <p className="text-gray-700 font-medium">
                    {booking?.package_details?.name}
                  </p>
                </div>

                {booking?.package_details?.card_details &&
                  booking.package_details.card_details.length > 0 && (
                    <div className="bg-primaryBlue/5 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">What&apos;s Included</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {booking.package_details.card_details.map(
                          (card, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{card.product_name}</span>
                              <span className="font-medium">
                                Qty: {card.quantity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {booking?.package_details?.package_details &&
                  booking.package_details.package_details.length > 0 && (
                    <div className="bg-primaryBlue/5 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Package Details</h4>
                      {booking.package_details.package_details.map(
                        (detail, index) => (
                          <div key={index} className="mt-2">
                            <div className="font-medium">{detail.title}</div>
                            <ul className="list-disc ml-6">
                              {detail.subtitles &&
                                detail.subtitles.map((subtitle, subIndex) => (
                                  <li key={subIndex} className="text-gray-700">
                                    {subtitle}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              {userRole !== "Service Provider" && (
                <>
                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Payment Details
                    </h3>
                    <div className="bg-primaryBlue/5 rounded-lg p-4">
                      {booking?.package_details?.bill_details &&
                        booking.package_details.bill_details.length > 0 && (
                          <div className="space-y-2">
                            {booking.package_details.bill_details.map(
                              (bill, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between"
                                >
                                  <span>{bill.type}</span>
                                  <span>₹{bill.amount.toLocaleString()}</span>
                                </div>
                              )
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>
                                ₹
                                {booking?.package_details.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                      {(!booking?.package_details?.bill_details ||
                        booking.package_details.bill_details.length === 0) && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Package Price</span>
                            <span>
                              ₹
                              {booking?.package_details?.price.toLocaleString()}
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>
                              ₹
                              {booking?.package_details?.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Payment Actions */}
              {userRole === "Client" &&
                booking?.payment_details.installment !== 1 &&
                booking?.invoices.length === 1 &&
                booking?.payment_details.dueAmount > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Payment Actions
                    </h3>
                    <Button
                      onClick={handleBalancePayment}
                      disabled={paying}
                      className="w-full bg-primaryOrange hover:bg-primaryOrange/90 text-white"
                    >
                      {paying
                        ? "Processing..."
                        : `Pay 2nd Installment (₹${(
                            (booking.payment_details.payablePrice * 40) /
                            100
                          ).toLocaleString()})`}
                    </Button>
                  </div>
                )}

              {/* Admin Payment Reminder Button */}
              {userRole === "Admin" &&
                booking?.payment_details.installment !== 1 &&
                booking?.invoices.length === 1 &&
                booking?.payment_details.dueAmount > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Payment Actions
                    </h3>
                    <Button
                      onClick={handlePaymentReminder}
                      className="bg-primaryBlue hover:bg-primaryBlue/90"
                    >
                      Send Payment Reminder
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Invoice History Card */}
          {userRole !== "Service Provider" && (
            <Card>
              <CardHeader className="bg-primaryBlue/5">
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {booking?.invoices && booking.invoices.length > 0 ? (
                  <div className="space-y-4">
                    {booking.invoices.map((invoice, index) => (
                      <div key={index} className="border p-3 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Date:</span>
                            <span className="text-sm">
                              {invoice.paymentDate
                                ? new Date(
                                    invoice.paymentDate
                                  ).toLocaleDateString()
                                : "Not specified"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Amount:</span>
                            <span className="text-sm">
                              ₹
                              {invoice.paidAmount
                                ? invoice.paidAmount.toLocaleString()
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Method:</span>
                            <span className="text-sm">
                              {invoice.paymentMethod}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Status:</span>
                            <span
                              className={`text-sm ${
                                invoice.paymentStatus === "Completed"
                                  ? "text-green-600"
                                  : invoice.paymentStatus === "Pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {invoice.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No invoices available
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Delivery Information Card */}
          <Card>
            <CardHeader className="bg-primaryBlue/5">
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Recipient Name:</span>
                  <p className="text-gray-700">
                    {booking?.delivery_address?.recipientName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="text-gray-700">
                    {booking?.delivery_address?.deliveryAddressLine1},
                    {booking?.delivery_address?.deliveryCity},
                    {booking?.delivery_address?.deliveryState} -
                    {booking?.delivery_address?.deliveryPincode}
                  </p>
                </div>
                {userRole !== "Service Provider" && (
                  <div>
                    <span className="font-medium">Contact:</span>
                    <p className="text-gray-700">
                      {booking?.delivery_address?.deliveryContactNumber}
                    </p>
                  </div>
                )}
                {booking?.delivery_address?.additionalDeliveryInstructions && (
                  <div>
                    <span className="font-medium">Instructions:</span>
                    <p className="text-gray-700">
                      {booking.delivery_address.additionalDeliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photography Preferences Card */}
          <Card>
            <CardHeader className="bg-primaryBlue/5">
              <CardTitle>Photography Preferences</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Photography Style:</span>
                  <p className="text-gray-700">
                    {booking?.payment_details?.preferredPhotographyStyle}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Editing Style:</span>
                  <p className="text-gray-700">
                    {booking?.payment_details?.preferredEditingStyle}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Reference Files:</span>
                  <p className="text-gray-700">
                    {booking?.payment_details?.referenceFiles?.length &&
                    booking?.payment_details?.referenceFiles?.length > 0
                      ? "Uploaded"
                      : "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* From Fields  */}
          <Card>
            <CardHeader className="bg-primaryBlue/5">
              <CardTitle>{booking?.form_details?.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {booking?.form_details &&
                  Object.entries(booking.form_details)
                    .filter(([key]) => key !== "title")
                    .map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span>
                        <p className="text-gray-700">{value}</p>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
