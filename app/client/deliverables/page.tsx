"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Create Razorpay order
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
            // Verify payment
            const verifyResponse = await axios.post(
              `${apiEndpoint}/payment/verify`,
              response
            );

            // Update booking as ordered
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
          name: selectedBooking?.basic_info?.fullName || user?.fullname,
          email: selectedBooking?.basic_info?.email || user?.email,
          contact: selectedBooking?.basic_info?.phoneNumber || "",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
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
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "physical" ? "default" : "outline"}
          onClick={() => setActiveTab("physical")}
        >
          Physical
        </Button>
        <Button
          variant={activeTab === "digital" ? "default" : "outline"}
          onClick={() => setActiveTab("digital")}
        >
          Digital
        </Button>
      </div>

      {activeTab === "physical" && deliverableBookings?.length === 0 ? (
        <div className="text-center text-gray-500/80 h-[20em] flex items-center justify-center text-[1.5em]">
          No Physical Deliverables Ready Yet
        </div>
      ) : activeTab === "digital" ? (
        <div className="text-center text-gray-500/80  h-[20em] flex items-center justify-center text-[1.5em]">
          No Digital Deliverables Ready Yet
        </div>
      ) : (
        deliverableBookings &&
        deliverableBookings?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverableBookings?.map((booking) => (
              <Card key={booking._id}>
                <CardHeader className="flex flex-row justify-between items-start">
                  <CardTitle className="text-sm font-medium">
                    {booking.booking_no}
                  </CardTitle>
                  <span className="text-sm text-green-600">
                    {booking.status === "Completed"
                      ? "Delivered"
                      : booking.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-semibold">
                      {booking.package_details.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.package_details.name}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/client/my-bookings/${booking._id}`)
                      }
                    >
                      View Details
                    </Button>
                    {!booking.ordered && (
                      <Button onClick={() => handleOrder(booking)}>
                        Order Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

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
