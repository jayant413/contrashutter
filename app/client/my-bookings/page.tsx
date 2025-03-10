"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";
import { BookingType, isApiError } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
import { DataTable } from "@/components/ui/data-table";
import GetBookingColumns from "@/components/columns/BookingColumns";
import Store from "@/helper/store";

export default function BookingList() {
  const [bookings, setBookings] = useState<BookingType[]>([]);

  const { user } = Store.useAuth();
  useEffect(() => {
    if (bookings) {
      console.log(bookings);
    }
  }, [bookings]);

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
            email: booking.basic_info.email,
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
      <SectionTitle title="My Bookings" hideBackButton />
      <DataTable columns={GetBookingColumns()} data={bookings || []} />
    </div>
  );
}
