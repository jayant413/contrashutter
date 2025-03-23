"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiEndpoint } from "@/helper/api";
import Store from "@/helper/store";
import { BookingType } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const { user, addNotification } = Store.useAuth();

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

  const handleSubmit = async () => {
    if (!selectedProviderId) {
      toast.info("Please select a service provider");
      return;
    }

    try {
      const response = await axios.put(
        `${apiEndpoint}/bookings/${bookingId}`,
        {
          servicePartner: selectedProviderId,
          assignedStatus: "Requested",
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Booking updated successfully");
        // Optionally, refresh the booking data here
        setBooking(response.data.updatedBooking);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const handlePaymentReminder = async () => {
    if (!booking?.userId) return;

    const notification = {
      title: "Payment Reminder",
      message:
        "Your second installment payment is due. Please complete the payment.",
      redirectPath: `/client/my-bookings/${bookingId}`,
    };

    try {
      await addNotification([notification], booking.userId._id);
      toast.success("Payment reminder sent successfully");
    } catch (error) {
      console.error("Error sending payment reminder:", error);
      toast.error("Failed to send payment reminder");
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
    <div className="grid grid-cols-2 gap-4 p-[2em]">
      <SectionTitle title="Booking Details" className="col-span-2 " />

      {/* Booking Number */}
      <section className="col-span-2 border-b pb-4">
        <div className="text-2xl font-semibold mb-4 text-primaryBlue">
          Booking Number:{" "}
          <span className="text-primaryOrange">{booking?.booking_no}</span>
        </div>
      </section>

      {/* Package Details */}
      <section className="col-span-2 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Package Details
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <strong>Package Name:</strong>{" "}
            <span className="text-gray-700">
              {booking?.package_details?.name}
            </span>
          </div>
          <div>
            <strong>Price:</strong>{" "}
            <span className="text-gray-700">
              ₹{booking?.package_details?.price}
            </span>
          </div>

          {booking?.package_details?.card_details &&
            booking.package_details.card_details.length > 0 && (
              <div>
                <strong>Package Inclusions:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {booking.package_details.card_details.map((card, index) => (
                    <li key={index} className="text-gray-700">
                      {card.product_name} - Quantity: {card.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {booking?.package_details?.package_details &&
            booking.package_details.package_details.length > 0 && (
              <div>
                <strong>Package Details:</strong>
                {booking.package_details.package_details.map(
                  (detail, index) => (
                    <div key={index} className="mt-2">
                      <div className="font-medium">{detail.title}</div>
                      <ul className="list-disc ml-6">
                        {detail.subtitles &&
                          detail.subtitles.map((subtitle, subIndex) => (
                            <li key={subIndex} className="text-gray-700">
                              {subtitle}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}

          {booking?.package_details?.bill_details &&
            booking.package_details.bill_details.length > 0 && (
              <div>
                <strong>Bill Breakdown:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {booking.package_details.bill_details.map((bill, index) => (
                    <li key={index} className="text-gray-700">
                      {bill.type}: ₹{bill.amount}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </section>
      {/* Status Change Section - Only visible to Admin */}
      {user?.role === "Admin" && (
        <section className="col-span-2 border-b pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
              Booking Status
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Status History</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Status History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {booking?.statusHistory?.map((history, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-semibold">Status: {history.status}</p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(history.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-4 items-center">
            <Select onValueChange={handleStatusChange} value={booking?.status}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>
      )}

      {/* Booking Overview */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Full Name:</strong>{" "}
            <span className="text-gray-700">
              {booking?.basic_info.fullName}
            </span>
          </div>
          <div>
            <strong>Gender:</strong>{" "}
            <span className="text-gray-700">{booking?.basic_info.gender}</span>
          </div>
          <div>
            <strong>Email:</strong>{" "}
            <span className="text-gray-700">{booking?.basic_info.email}</span>
          </div>
          <div>
            <strong>Phone Number:</strong>{" "}
            <span className="text-gray-700">
              {booking?.basic_info.phoneNumber}
            </span>
          </div>
          <div className="col-span-2">
            <strong>Address:</strong>{" "}
            <span className="text-gray-700">
              {booking?.basic_info.addressLine1}, {booking?.basic_info.city},{" "}
              {booking?.basic_info.state} - {booking?.basic_info.pincode}
            </span>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Event Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Event Name:</strong>{" "}
            <span className="text-gray-700">{booking?.eventName}</span>
          </div>
          <div>
            <strong>Event Date:</strong>{" "}
            <span className="text-gray-700">
              {booking?.event_details.eventDate
                ? new Date(booking.event_details.eventDate).toLocaleDateString()
                : "Not specified"}
            </span>
          </div>
          <div>
            <strong>Venue:</strong>{" "}
            <span className="text-gray-700">
              {booking?.event_details.venueName || "Not provided"},{" "}
              {booking?.event_details.venueCity}
            </span>
          </div>
          <div>
            <strong>Number of Guests:</strong>{" "}
            <span className="text-gray-700">
              {booking?.event_details.numberOfGuests}
            </span>
          </div>
        </div>
      </section>

      {/* Delivery Information */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Delivery Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Recipient Name:</strong>{" "}
            <span className="text-gray-700">
              {booking?.delivery_address.recipientName}
            </span>
          </div>
          <div>
            <strong>Address:</strong>{" "}
            <span className="text-gray-700">
              {booking?.delivery_address.deliveryAddressLine1},{" "}
              {booking?.delivery_address.deliveryCity},{" "}
              {booking?.delivery_address.deliveryState} -{" "}
              {booking?.delivery_address.deliveryPincode}
            </span>
          </div>
          <div>
            <strong>Contact Number:</strong>{" "}
            <span className="text-gray-700">
              {booking?.delivery_address.deliveryContactNumber}
            </span>
          </div>
          <div className="col-span-2">
            <strong>Additional Instructions:</strong>{" "}
            <span className="text-gray-700">
              {booking?.delivery_address.additionalDeliveryInstructions ||
                "None"}
            </span>
          </div>
        </div>
      </section>

      {/* Photography Preferences */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Photography Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Preferred Style:</strong>{" "}
            <span className="text-gray-700">
              {booking?.payment_details.preferredPhotographyStyle}
            </span>
          </div>
          <div>
            <strong>Editing Style:</strong>{" "}
            <span className="text-gray-700">
              {booking?.payment_details.preferredEditingStyle}
            </span>
          </div>
          <div className="col-span-2">
            <strong>Reference Files:</strong>{" "}
            <span className="text-gray-700">
              {booking?.payment_details.referenceFiles?.length &&
              booking?.payment_details.referenceFiles?.length > 0
                ? "Uploaded"
                : "None"}
            </span>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Payment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Preferred Method:</strong>{" "}
            <span className="text-gray-700">
              {booking?.payment_details.preferredPaymentMethod}
            </span>
          </div>
          <div>
            <strong>Payment Type:</strong>{" "}
            <span className="text-gray-700">
              {booking?.payment_details.paymentType}
            </span>
          </div>
        </div>
      </section>

      {/* Service Provider Selection */}
      {booking?.servicePartner ? (
        <section className="border-b pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
              Service Provider Assigned
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Response History</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Response History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {booking?.assignedStatusHistory?.map((history, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-semibold">Status: {history.status}</p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(history.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-gray-700">{booking?.servicePartner.name}</div>
        </section>
      ) : (
        <section className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
              Assign Service Provider
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Response History</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Response History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {booking?.assignedStatusHistory?.map((history, index) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-semibold">Status: {history.status}</p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(history.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between items-center">
            <Select onValueChange={(value) => setSelectedProviderId(value)}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select a Service Provider" />
              </SelectTrigger>
              <SelectContent>
                {filteredServicePartners.active.map((provider) => (
                  <SelectItem key={provider._id} value={provider._id || ""}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="px-6 py-2" onClick={handleSubmit}>
              Submit
            </Button>{" "}
          </div>
        </section>
      )}

      {/* Payment Actions Section */}
      {booking?.payment_details.installment !== 1 &&
        booking?.invoices.length === 1 && (
          <section className="col-span-2 border-b pb-4">
            <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
              Payment Actions
            </h2>
            <div className="flex gap-4">
              {user?.role === "Admin" && (
                <Button onClick={handlePaymentReminder}>
                  Send Payment Reminder
                </Button>
              )}
            </div>
          </section>
        )}

      {/* Invoices Section */}
      <section className="col-span-2 border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Invoice History
        </h2>
        <div className="space-y-4">
          {booking?.invoices?.map((invoice, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Payment Date:</strong>{" "}
                  <span>
                    {invoice.paymentDate
                      ? new Date(invoice.paymentDate).toLocaleDateString()
                      : "Not specified"}
                  </span>
                </div>
                <div>
                  <strong>Amount Paid:</strong>{" "}
                  <span>₹{invoice.paidAmount}</span>
                </div>
                <div>
                  <strong>Payment Method:</strong>{" "}
                  <span>{invoice.paymentMethod}</span>
                </div>
                <div>
                  <strong>Status:</strong> <span>{invoice.paymentStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
