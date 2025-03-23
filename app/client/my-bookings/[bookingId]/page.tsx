"use client";
// Library Imports
import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

// Project Imports
import { apiEndpoint } from "@/helper/api";
import { BookingType, RazorpayOrderIdType } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
import { Button } from "@/components/ui/button";
import Store from "@/helper/store";
import { toast } from "sonner";

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [paying, startPayment] = useTransition();
  const { user, checkLogin } = Store.useAuth();

  const { getAllServicePartners } = Store.useServicePartner();

  const handleBalancePayment = async () => {
    if (!booking) return;

    const dueAmount = booking.payment_details.dueAmount;

    startPayment(async () => {
      const paymentAmount = dueAmount / 2;
      try {
        const { data } = await axios.post(
          `${apiEndpoint}/payment/create-order`,
          {
            amount: paymentAmount * 100, // Convert to paisa
            currency: "INR",
            receipt: booking._id,
          }
        );

        if (!window.Razorpay) {
          toast.error("Razorpay SDK failed to load");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Contrashutter",
          description: "Balance Payment for Booking",
          order_id: data.id,
          handler: async function (response: RazorpayOrderIdType) {
            try {
              const verifyResponse = await axios.post(
                `${apiEndpoint}/payment/verify`,
                response
              );

              if (verifyResponse.status === 200) {
                // Update booking with payment details
                const updateResponse = await axios.put(
                  `${apiEndpoint}/bookings/${bookingId}`,
                  {
                    payment_details: {
                      ...booking.payment_details,
                      paidAmount:
                        booking.payment_details.paidAmount + paymentAmount,
                      dueAmount:
                        booking.payment_details.dueAmount - paymentAmount,
                      paymentStatus: "Partial",
                      razorpayOrderId: data.id,
                      razorpayPaymentId: response.razorpay_payment_id,
                    },
                  },
                  {
                    withCredentials: true,
                  }
                );
                checkLogin();
                setBooking(updateResponse.data.updatedBooking);
                toast.success("Balance payment completed successfully");
              }
            } catch (error) {
              console.error("Error processing payment:", error);
              toast.error("Payment failed");
            }
          },
          prefill: {
            name: user?.fullname,
            email: user?.email,
            contact: user?.contact,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error creating payment order:", error);
        toast.error("Failed to initiate payment");
      }
    });
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

  // Load Razorpay dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);
  }, []);

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

      {/* Payment Actions Section */}
      {booking?.payment_details.installment !== 1 &&
        booking?.invoices.length === 1 && (
          <section className="col-span-2 border-b pb-4">
            <h2 className="text-2xl font-semibold mb-4 text-primaryBlue">
              Payment Actions
            </h2>
            <div className="flex gap-4">
              {booking?.payment_details.dueAmount &&
                booking?.payment_details.dueAmount > 0 && (
                  <Button onClick={handleBalancePayment} disabled={paying}>
                    {paying ? "Processing..." : "Pay Balance"}
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
