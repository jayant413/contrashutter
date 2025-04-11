"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useBooking from "@/helper/store/useBooking";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";
import { BookingType, RazorpayOrderIdType } from "@/types";
import Store from "@/helper/store";
import Image from "next/image";
import { Download, ExternalLink, FileText, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DigitalDeliverableType = {
  id: string;
  bookingId: string;
  name: string;
  description: string;
  type: "Image Gallery" | "Video";
  count?: number;
  duration?: string;
  date: string;
  image: string;
};

const Deliverables = () => {
  const [activeTab, setActiveTab] = useState<"physical" | "digital">(
    "physical"
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const { allBookings, getAllBookings } = useBooking();
  const router = useRouter();
  const { user } = Store.useAuth();

  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  const digitalDeliverables: DigitalDeliverableType[] = [];

  const deliverableBookings = allBookings?.filter(
    (booking) =>
      booking.status === "Deliverables Ready" || booking.status === "Completed"
  );

  const handleOrder = async (booking: BookingType) => {
    if (booking.payment_details.installment === 1) {
      try {
        await axios.put(
          `${apiEndpoint}/bookings/${booking._id}`,
          { ordered: true },
          { withCredentials: true }
        );
        toast.success("Ordered successfully");
        getAllBookings();
      } catch (error) {
        console.error("Error ordering:", error);
        toast.error("Failed to order");
      }
    } else {
      setSelectedBooking(booking);
      setShowDialog(true);
    }
  };

  const handlePayment = async () => {
    if (!selectedBooking) return;

    try {
      const orderRes = await axios.post(
        `${apiEndpoint}/payment/create-order`,
        {
          amount: selectedBooking.payment_details.dueAmount * 100,
          currency: "INR",
          receipt: selectedBooking._id,
        },
        { withCredentials: true }
      );

      if (!window.Razorpay) {
        toast.error(
          "Razorpay SDK failed to load. Check your internet connection."
        );
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Contra Studio",
        description: "Payment for booking",
        order_id: orderRes.data.id,
        handler: async (response: RazorpayOrderIdType) => {
          try {
            const verifyResponse = await axios.post(
              `${apiEndpoint}/payment/verify`,
              response
            );

            if (verifyResponse.status === 200) {
              await axios.put(
                `${apiEndpoint}/bookings/${selectedBooking._id}`,
                {
                  ordered: true,
                  payment_details: {
                    razorpayOrderId: orderRes.data.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                  },
                },
                { withCredentials: true }
              );

              toast.success("Payment successful and order placed!");
              setShowDialog(false);
              getAllBookings();
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: selectedBooking?.userId?.fullname || user?.fullname,
          email: selectedBooking?.userId?.email || user?.email,
          contact: selectedBooking?.userId?.contact || "",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, []);

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Deliverables</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Access and download all your digital and physical deliverables
        </p>
      </div>

      <Tabs
        defaultValue="physical"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "physical" | "digital")}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger
            value="physical"
            className="data-[state=active]:bg-primaryBlue data-[state=active]:text-white"
          >
            Physical
          </TabsTrigger>
          <TabsTrigger
            value="digital"
            className="data-[state=active]:bg-primaryOrange data-[state=active]:text-white"
          >
            Digital
          </TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="mt-0">
          {deliverableBookings?.length === 0 ? (
            <div className="text-center text-gray-500/80 h-[20em] flex items-center justify-center text-[1.5em]">
              No Physical Deliverables Ready Yet
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {deliverableBookings?.map((booking) => (
                <Card key={booking._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt={booking.package_details.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold">
                          {booking.package_details.name}
                        </h3>
                        <p className="text-sm text-white/80">
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {booking.package_details.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.status === "Completed"
                          ? "Delivered"
                          : booking.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primaryBlue hover:text-primaryOrange"
                        onClick={() =>
                          router.push(`/client/my-bookings/${booking._id}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {!booking.ordered ? (
                      <Button
                        className="w-full bg-primaryOrange hover:bg-primaryOrange/90"
                        onClick={() => handleOrder(booking)}
                      >
                        Order Now
                      </Button>
                    ) : (
                      <div className="w-full">
                        <p className="text-xs text-gray-500 mb-1">
                          Booking Number:
                        </p>
                        <div className="flex items-center justify-between">
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                            {booking.booking_no || "Not available"}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primaryBlue hover:text-primaryOrange cursor-default hover:bg-transparent"
                          >
                            Ordered
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="digital" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {digitalDeliverables?.length === 0 ? (
              <div className="text-center text-gray-500/80 h-[20em] flex items-center justify-center text-[1.5em] col-span-full">
                No Digital Deliverables Ready Yet
              </div>
            ) : (
              digitalDeliverables?.map((deliverable) => (
                <Card key={deliverable.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={deliverable.image || "/placeholder.svg"}
                      alt={deliverable.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold">{deliverable.name}</h3>
                        <p className="text-sm text-white/80">
                          {deliverable.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {deliverable.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {deliverable.type === "Image Gallery" ? (
                          <ImageIcon className="h-4 w-4 text-primaryOrange" />
                        ) : (
                          <FileText className="h-4 w-4 text-primaryOrange" />
                        )}
                        <span className="text-sm font-medium">
                          {deliverable.type === "Image Gallery"
                            ? `${deliverable.count} Photos`
                            : `${deliverable.duration} Minutes`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primaryBlue hover:text-primaryOrange"
                        onClick={() =>
                          router.push(
                            `/client/my-bookings/${deliverable.bookingId}`
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-primaryOrange hover:bg-primaryOrange/90">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Please complete your 3rd installment to place the order.</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={handlePayment}>Pay Now</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deliverables;
