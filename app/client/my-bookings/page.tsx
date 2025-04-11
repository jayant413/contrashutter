"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";
import { BookingType, isApiError } from "@/types";
import Store from "@/helper/store";
import BookingTable from "../../../components/pages/booking/BookingsTable";
export default function BookingList() {
  const [bookings, setBookings] = useState<BookingType[]>([]);

  const { user } = Store.useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/bookings/user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setBookings(
          response.data.map((booking: BookingType) => ({
            ...booking,
            email: booking.userId?.email,
          }))
        );
      } catch (err) {
        if (isApiError(err)) {
          // setError(err.message);
          return;
        }
        console.error(err);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="p-[2em]">
      <BookingTable bookings={bookings} />
    </div>
  );
}
