"use client";
import { BookingType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Store from "@/helper/store";

const GetBookingColumns = () => {
  const { user } = Store.useAuth();

  const BookingColumns: ColumnDef<BookingType>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link
                href={`${
                  user?.role == "Admin"
                    ? `/admin/bookings/${booking._id}`
                    : user?.role == "Client"
                    ? `/client/my-bookings/${booking._id}`
                    : user?.role == "Service Provider"
                    ? `/partner/bookings/${booking._id}`
                    : "/"
                }`}
              >
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status:
          | "Booked"
          | "In Progress"
          | "Deliverables Ready"
          | "Completed"
          | "Cancelled" = row.getValue("status");
        let colorClass = "";

        switch (status) {
          case "Booked":
            colorClass = "text-blue-500";
            break;
          case "In Progress":
            colorClass = "text-yellow-500";
            break;
          case "Deliverables Ready":
            colorClass = "text-orange-500";
            break;
          case "Completed":
            colorClass = "text-green-500";
            break;
          case "Cancelled":
            colorClass = "text-red-500";
            break;
          default:
            colorClass = "text-black";
        }

        return <span className={colorClass}>{status}</span>;
      },
    },
    {
      accessorKey: "basic_info.fullName",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "event_details.numberOfGuests",
      header: "Number of Guests",
    },
    {
      accessorKey: "event_details.venueName",
      header: "Venue Name",
    },
    {
      accessorKey: "basic_info.phoneNumber",
      header: "Phone Number",
    },
  ];

  return BookingColumns;
};
export default GetBookingColumns;
