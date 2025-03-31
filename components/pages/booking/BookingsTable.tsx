"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookingType } from "@/types";
import { ExternalLink } from "lucide-react";

export default function BookingTable({
  bookings,
}: {
  bookings: BookingType[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(
    (booking: BookingType) =>
      booking.booking_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.basic_info.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=" md:mx-auto py-8">
      <Card>
        <CardHeader className="bg-primaryBlue/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Bookings</CardTitle>
              <CardDescription>
                View and manage all your bookings
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryBlue/5 hover:bg-primaryBlue/10">
                  <TableHead></TableHead>
                  <TableHead className="font-medium">Booking No</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Number</TableHead>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-primaryBlue/5"
                    >
                      <TableCell>
                        <Link
                          href={`/client/my-bookings/${booking._id}`}
                          className="text-primaryBlue hover:text-primaryOrange font-medium"
                        >
                          <span className="text-primaryBlue hover:text-primaryOrange flex items-center">
                            <ExternalLink className="h-[0.85em] w-[0.85em] mr-1 translate-y-[0.1em]" />
                            View Details
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/client/my-bookings/${booking._id}`}
                          className="text-primaryBlue hover:text-primaryOrange font-medium"
                        >
                          {booking.booking_no}
                        </Link>
                      </TableCell>
                      <TableCell>{booking.basic_info.fullName}</TableCell>
                      <TableCell className=" w-fit ">
                        <span
                          className={` px-2 py-1 rounded-full  text-xs font-medium ${
                            booking.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "Deliverables Ready"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>{booking.basic_info.phoneNumber}</TableCell>
                      <TableCell>{booking.basic_info.email}</TableCell>
                      <TableCell className="text-right">
                        ₹{booking.package_details.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
