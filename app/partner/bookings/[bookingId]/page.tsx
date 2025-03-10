"use client";
// Library Imports
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Project Imports
import { apiEndpoint } from "@/helper/api";
import { BookingType } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
import { toast } from "sonner";
import Store from "@/helper/store";

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const { user } = Store.useAuth();

  const getLastResponse = () => {
    if (!booking?.assignedStatusHistory?.length) return null;
    return booking.assignedStatusHistory[0];
  };

  const handleSubmit = async (
    status: "Accepted" | "Rejected",
    selectedProviderId: string | null
  ) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/bookings/${bookingId}`,
        {
          servicePartner: selectedProviderId,
          assignedStatus: status,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Booking updated successfully");
        setBooking(response.data.updatedBooking);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

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

  const lastResponse = getLastResponse();
  const showActionButtons =
    !lastResponse || lastResponse.status === "Requested";

  return (
    <div className="grid grid-cols-2 gap-4 p-[2em]">
      <SectionTitle title="Booking Details" className="col-span-2 " />

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

      {/* Response Section */}
      <section className="border-b pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primaryBlue">Response</h2>
        </div>

        {showActionButtons ? (
          <div className="flex justify-between items-center">
            <Button
              className="px-6 py-2"
              onClick={() => handleSubmit("Accepted", user?.partnerId || null)}
            >
              Accept
            </Button>
            <Button
              className="px-6 py-2"
              onClick={() => handleSubmit("Rejected", user?.partnerId || null)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <div
            className={`text-${
              lastResponse.status === "Accepted" ? "green" : "red"
            }-700`}
          >
            {lastResponse.status}
          </div>
        )}
      </section>
    </div>
  );
}
