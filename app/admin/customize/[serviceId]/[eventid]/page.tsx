"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { apiEndpoint } from "@/helper/api";
import { isApiError } from "@/types";
import SectionTitle from "@/components/custom/SectionTitle";
interface Package {
  _id: string;
  name: string;
  price: number;
  booking_price: number;
  serviceId: string;
  eventId: string;
  card_details: { product_name: string; quantity: string }[];
  package_details: { title: string; subtitle: string[] }[];
  bill_details: { type: string; amount: string }[];
}

interface Service {
  _id: string;
  name: string;
}

interface Event {
  _id: string;
  eventName: string;
}

interface CardDetail {
  product: string;
  quantity: string;
}

interface PackageDetail {
  title: string;
  subtitles: string[];
}

interface BillDetail {
  type: string;
  amount: string;
}

const PackagesPage = ({ params }: { params: Promise<{ eventid: string }> }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [bookingPrice, setBookingPrice] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [eventId, setEventId] = useState("");
  const [cardDetails, setCardDetails] = useState<CardDetail[]>([
    { product: "", quantity: "" },
  ]);
  const [packageDetails, setPackageDetails] = useState<PackageDetail[]>([
    { title: "", subtitles: [] },
  ]);
  const [billDetails, setBillDetails] = useState<BillDetail[]>([
    { type: "", amount: "" },
  ]);
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch packages
  useEffect(() => {
    const getPackages = async () => {
      setLoading(true);
      try {
        const { eventid } = await params;
        const res = await axios.get(`${apiEndpoint}/packages/event/${eventid}`);
        setPackages(res.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError("Failed to fetch packages.");
      } finally {
        setLoading(false);
      }
    };

    getPackages();
  }, [params]);

  // Fetch services
  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services.");
      }
    };

    getServices();
  }, []);

  // Fetch events when service is selected
  useEffect(() => {
    if (serviceId) {
      const getEvents = async () => {
        try {
          const res = await axios.get(`${apiEndpoint}/services/${serviceId}`);
          setEvents(res.data.events);
        } catch (error) {
          console.error("Error fetching events:", error);
          setError("Failed to fetch events.");
        }
      };

      getEvents();
    }
  }, [serviceId]);

  // Set form data when package is selected for editing
  useEffect(() => {
    if (packageToEdit) {
      setPackageName(packageToEdit.name);
      setPackagePrice(packageToEdit.price.toString());
      setBookingPrice(packageToEdit.booking_price.toString());
      setServiceId(packageToEdit.serviceId);
      setEventId(packageToEdit.eventId);

      // Map card details from backend to frontend format
      setCardDetails(
        packageToEdit.card_details.map((card) => ({
          product: card.product_name || "",
          quantity: card.quantity || "",
        }))
      );

      // Map package details from backend to frontend format
      setPackageDetails(
        packageToEdit.package_details.map((detail) => ({
          title: detail.title || "",
          subtitles: Array.isArray(detail.subtitle) ? detail.subtitle : [],
        }))
      );

      setBillDetails(packageToEdit.bill_details);
    }
  }, [packageToEdit]);

  const addCardDetail = () => {
    setCardDetails([...cardDetails, { product: "", quantity: "" }]);
  };

  const addPackageDetail = () => {
    setPackageDetails([...packageDetails, { title: "", subtitles: [] }]);
  };

  const addBillDetail = () => {
    setBillDetails([...billDetails, { type: "", amount: "" }]);
  };

  const addSubtitle = (index: number) => {
    const newPackageDetails = [...packageDetails];
    if (!Array.isArray(newPackageDetails[index].subtitles)) {
      newPackageDetails[index].subtitles = [];
    }
    newPackageDetails[index].subtitles.push("");
    setPackageDetails(newPackageDetails);
  };

  const removeSubtitle = (index: number, subtitleIndex: number) => {
    const newPackageDetails = [...packageDetails];
    newPackageDetails[index].subtitles.splice(subtitleIndex, 1);
    setPackageDetails(newPackageDetails);
  };

  const removeTitle = (index: number) => {
    const newPackageDetails = [...packageDetails];
    newPackageDetails.splice(index, 1);
    setPackageDetails(newPackageDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageToEdit) {
      setError("No package selected for editing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Basic validation
      if (
        !serviceId ||
        !eventId ||
        !packageName ||
        !packagePrice ||
        !bookingPrice
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Validate card details
      const validCardDetails = cardDetails.filter(
        (card) => card.product.trim() !== ""
      );
      if (validCardDetails.length === 0) {
        setError("At least one card detail is required");
        return;
      }

      // Validate package details
      const validPackageDetails = packageDetails.filter(
        (detail) => detail.title.trim() !== ""
      );
      if (validPackageDetails.length === 0) {
        setError("At least one package detail is required");
        return;
      }

      // Validate bill details
      const validBillDetails = billDetails.filter(
        (bill) => bill.type.trim() !== ""
      );
      if (validBillDetails.length === 0) {
        setError("At least one bill detail is required");
        return;
      }

      const payload = {
        serviceId,
        eventId,
        name: packageName.trim(),
        price: Number(packagePrice),
        booking_price: Number(bookingPrice),
        card_details: validCardDetails.map((card) => ({
          product_name: card.product.trim(),
          quantity: card.quantity,
        })),
        package_details: validPackageDetails.map((detail) => ({
          title: detail.title.trim(),
          subtitle: detail.subtitles.filter(
            (subtitle) => subtitle.trim() !== ""
          ),
        })),
        bill_details: validBillDetails.map((bill) => ({
          type: bill.type.trim(),
          amount: bill.amount,
        })),
      };

      await axios.put(`${apiEndpoint}/packages/${packageToEdit._id}`, payload);

      // Reset form and refresh data
      setPackageToEdit(null);
      setPackageName("");
      setPackagePrice("");
      setBookingPrice("");
      setCardDetails([{ product: "", quantity: "" }]);
      setPackageDetails([{ title: "", subtitles: [] }]);
      setBillDetails([{ type: "", amount: "" }]);

      // Refresh packages list
      const { eventid } = await params;
      const response = await axios.get(
        `${apiEndpoint}/packages/event/${eventid}`
      );
      setPackages(response.data);
    } catch (error) {
      if (isApiError(error)) {
        console.error("Error details:", error);
        setError("Failed to update package");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen  p-6">
      <SectionTitle title={`Event Packages`} />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg">
        {packageToEdit ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Edit Package</h1>
            {/* Basic Package Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Package Name
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Package Price
                </label>
                <input
                  type="number"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Booking Price
                </label>
                <input
                  type="number"
                  value={bookingPrice}
                  onChange={(e) => setBookingPrice(e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>

            {/* Service and Event Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Select Service
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="border p-2 rounded-md w-full"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Select Event</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="border p-2 rounded-md w-full"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.eventName}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Details Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Card Details</h2>
              {cardDetails.map((card, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    value={card.product}
                    onChange={(e) => {
                      const newCardDetails = [...cardDetails];
                      newCardDetails[index].product = e.target.value;
                      setCardDetails(newCardDetails);
                    }}
                    placeholder="Product Name"
                    className="border p-2 rounded-md"
                  />
                  <input
                    type="text"
                    value={card.quantity}
                    onChange={(e) => {
                      const newCardDetails = [...cardDetails];
                      newCardDetails[index].quantity = e.target.value;
                      setCardDetails(newCardDetails);
                    }}
                    placeholder="Quantity"
                    className="border p-2 rounded-md"
                  />
                </div>
              ))}
              <Button
                onClick={addCardDetail}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add More
              </Button>
            </div>

            {/* Package Details Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Package Details</h2>
              {packageDetails.map((detail, index) => (
                <div key={index} className="mt-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={detail.title}
                      onChange={(e) => {
                        const newPackageDetails = [...packageDetails];
                        newPackageDetails[index].title = e.target.value;
                        setPackageDetails(newPackageDetails);
                      }}
                      placeholder="Title"
                      className="border p-2 rounded-md w-full"
                    />
                    <Button
                      className="ml-2 text-white bg-blue-500"
                      onClick={() => removeTitle(index)}
                    >
                      X
                    </Button>
                  </div>
                  {Array.isArray(detail.subtitles) &&
                    detail.subtitles.map((subtitle, subtitleIndex) => (
                      <div
                        key={subtitleIndex}
                        className="flex justify-between items-center mt-2 mx-4"
                      >
                        <input
                          type="text"
                          value={subtitle}
                          onChange={(e) => {
                            const newPackageDetails = [...packageDetails];
                            newPackageDetails[index].subtitles[subtitleIndex] =
                              e.target.value;
                            setPackageDetails(newPackageDetails);
                          }}
                          placeholder="Subtitle"
                          className="border p-2 rounded-md w-full"
                        />
                        <Button
                          className="ml-2 text-white bg-blue-500"
                          onClick={() => removeSubtitle(index, subtitleIndex)}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  <Button
                    onClick={() => addSubtitle(index)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Subtitle
                  </Button>
                </div>
              ))}
              <Button
                onClick={addPackageDetail}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Title
              </Button>
            </div>

            {/* Bill Details Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Bill Details</h2>
              {billDetails.map((bill, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    value={bill.type}
                    onChange={(e) => {
                      const newBillDetails = [...billDetails];
                      newBillDetails[index].type = e.target.value;
                      setBillDetails(newBillDetails);
                    }}
                    placeholder="Type"
                    className="border p-2 rounded-md"
                  />
                  <input
                    type="text"
                    value={bill.amount}
                    onChange={(e) => {
                      const newBillDetails = [...billDetails];
                      newBillDetails[index].amount = e.target.value;
                      setBillDetails(newBillDetails);
                    }}
                    placeholder="Amount"
                    className="border p-2 rounded-md"
                  />
                </div>
              ))}
              <Button
                onClick={addBillDetail}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add More
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Submit Package
            </Button>
          </div>
        ) : (
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white shadow-md rounded-lg p-4"
                  >
                    <h2 className="font-semibold text-lg">{pkg.name}</h2>
                    <p className="mt-2 text-sm">Price: {pkg.price}</p>
                    <p className="text-sm">
                      Booking Price: {pkg.booking_price}
                    </p>
                    <Button
                      onClick={() => setPackageToEdit(pkg)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
