"use client";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import axios from "axios";

import { apiEndpoint } from "@/helper/api";
import Store from "@/helper/store";
import { BookingType } from "@/types";
import { toast } from "sonner";
import BookingDetails from "@/components/pages/booking/BookingDetails";

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingType | null>(null);

  const { filteredServicePartners, getAllServicePartners } =
    Store.useServicePartner();

  const statusOptions = [
    "Booked",
    "In Progress",
    "Deliverables Ready",
    "Completed",
    "Cancelled",
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return;

    // Check if status change is in forward direction
    const currentIndex = statusOptions.indexOf(booking.status || "");
    const newIndex = statusOptions.indexOf(newStatus);

    if (newIndex < currentIndex) {
      toast.error("Status can only be changed in forward direction");
      return;
    }

    try {
      const response = await axios.put(
        `${apiEndpoint}/bookings/${bookingId}`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Status updated successfully");
        setBooking(response.data.updatedBooking);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

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

  useEffect(() => {
    getAllServicePartners();
  }, [getAllServicePartners]);

  return (
    <BookingDetails
      booking={booking}
      userRole="Admin"
      setBooking={setBooking}
      handleStatusChange={handleStatusChange}
      getAllServicePartners={getAllServicePartners}
      filteredServicePartners={filteredServicePartners}
    />
  );
}
