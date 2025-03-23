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
        </div>
      </section>
      {/* Delivery Information */}
      <section className="border-b pb-4">
        <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
          Delivery Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Address:</strong>{" "}
            <span className="text-gray-700">
              {booking?.delivery_address.deliveryAddressLine1},{" "}
              {booking?.delivery_address.deliveryCity},{" "}
              {booking?.delivery_address.deliveryState} -{" "}
              {booking?.delivery_address.deliveryPincode}
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
