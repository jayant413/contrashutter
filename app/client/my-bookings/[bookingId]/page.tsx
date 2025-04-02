"use client";
// Library Imports
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

// Project Imports
import { apiEndpoint } from "@/helper/api";
import { BookingType } from "@/types";
import Store from "@/helper/store";
import BookingDetails from "@/components/pages/booking/BookingDetails";

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const { user, checkLogin } = Store.useAuth();

  // Load Razorpay dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!bookingId) return;

    axios
      .get(`${apiEndpoint}/bookings/${bookingId}`)
      .then((response) => {
        setBooking(response.data);
      })
      .catch((err) => {
        console.error("Error fetching booking:", err);
      });
  }, [bookingId]);

  return (
    <BookingDetails
      booking={booking}
      userRole="Client"
      userId={user?._id}
      setBooking={setBooking}
      checkLogin={checkLogin}
    />
  );
}
