"use client";
import React, { useEffect, useState } from "react";
import Store from "@/helper/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingType } from "@/types";
import BookingTable from "@/components/pages/booking/BookingsTable";

const Bookings = () => {
  const { allBookings, getAllBookings } = Store.useBooking();
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Booked"
    | "In Progress"
    | "Deliverables Ready"
    | "Completed"
    | "Cancelled"
  >("All");
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    if (!allBookings) {
      getAllBookings();
    }
  }, [allBookings, getAllBookings]);

  useEffect(() => {
    if (allBookings) {
      if (activeTab === "All") {
        setFilteredBookings(allBookings);
      } else {
        const filtered = allBookings.filter(
          (booking) => booking.status === activeTab
        );
        setFilteredBookings(filtered);
      }
    }
  }, [allBookings, activeTab]);

  const statusButtons = [
    { label: "All", value: "All" },
    { label: "Booked", value: "Booked" },
    { label: "In Progress", value: "In Progress" },
    { label: "Deliverables Ready", value: "Deliverables Ready" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div className="p-[2em]">
      <div className="flex gap-4 mb-6 flex-wrap">
        {statusButtons.map((button) => (
          <Button
            key={button.value}
            onClick={() => setActiveTab(button.value as typeof activeTab)}
            variant={activeTab === button.value ? "default" : "outline"}
            className={cn("min-w-[100px]")}
          >
            {button.label}
          </Button>
        ))}
      </div>

      <BookingTable bookings={filteredBookings || []} />
    </div>
  );
};

export default Bookings;
