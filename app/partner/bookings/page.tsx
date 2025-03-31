"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useBooking from "@/helper/store/useBooking";
import { BookingType } from "@/types";
import BookingTable from "@/components/pages/booking/BookingsTable";

/**
 *  view detials , package name, status, venue city, event date, event start time, event end time,
 */

const ServiceBookings = () => {
  const { allBookings, getAllBookings } = useBooking();
  const [activeTab, setActiveTab] = useState<
    "Requested" | "Accepted" | "Completed"
  >("Requested");
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  useEffect(() => {
    if (allBookings) {
      // Filter bookings based on last status in assignedStatusHistory
      const filtered = allBookings.filter((booking) => {
        if (!booking.assignedStatusHistory?.length) return false;
        const lastStatus = booking.assignedStatusHistory[0].status;

        switch (activeTab) {
          case "Requested":
            return lastStatus === "Requested";
          case "Accepted":
            return lastStatus === "Accepted";
          case "Completed":
            return lastStatus === "Completed";
          default:
            return false;
        }
      });

      // Filter out bookings with "Rejected" status
      const nonRejected = filtered.filter(
        (booking) => booking.assignedStatusHistory[0].status !== "Rejected"
      );

      setFilteredBookings(nonRejected);
    }
  }, [allBookings, activeTab]);

  const statusButtons = [
    { label: "Requested", value: "Requested" },
    { label: "Accepted", value: "Accepted" },
    { label: "Completed", value: "Completed" },
  ];

  return (
    <div className="p-[2em]">
      <div className="flex gap-4 mb-6">
        {statusButtons.map((button) => (
          <Button
            key={button.value}
            onClick={() =>
              setActiveTab(
                button.value as "Requested" | "Accepted" | "Completed"
              )
            }
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

export default ServiceBookings;
