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
  const { user } = Store.useAuth();

  useEffect(() => {
    if (!bookingId) return;

    axios
      .get(`${apiEndpoint}/bookings/${bookingId}`, {
        withCredentials: true,
      })
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
      userRole="Service Provider"
      partnerId={user?.partnerId}
      setBooking={setBooking}
    />
  );
}
