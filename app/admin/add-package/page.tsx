"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiEndpoint } from "@/helper/api";

interface Service {
  _id: string;
  name: string;
}

interface Event {
  _id: string;
  eventName: string;
}

const AddPackagePage = () => {
  const [serviceName, setServiceName] = useState("");
  const [eventName, setEventName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [bookingPrice, setBookingPrice] = useState("");

  const [cardDetails, setCardDetails] = useState([
    { product: "", quantity: "" },
  ]);
  const [packageDetails, setPackageDetails] = useState([
    { title: "", subtitles: [""] },
  ]);
  const [billDetails, setBillDetails] = useState([{ type: "", amount: "" }]);

  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Find the service and event IDs
      const service = services.find((s) => s.name === serviceName);
      const event = events.find((e) => e.eventName === eventName);

      if (!service?._id || !event?._id) {
        alert("Service or Event not found");
        return;
      }

      const packageData = {
        serviceId: service._id,
        eventId: event._id,
        name: packageName,
        price: Number(packagePrice),
        booking_price: Number(bookingPrice) || 0,
        card_details: cardDetails.map((card) => ({
          product_name: card.product, // Changed from product to product_name
          quantity: Number(card.quantity),
        })),
        package_details: packageDetails.map((detail) => ({
          title: detail.title,
          subtitles: detail.subtitles, // Changed from subtitles array to subtitle
        })),
        bill_details: billDetails.map((bill) => ({
          type: bill.type,
          amount: Number(bill.amount),
        })),
        category: selectedCategory || "",
      };

      await axios.post(`${apiEndpoint}/packages`, packageData);
      alert("Package created successfully!");
      // router.push("/admin/packages");
    } catch (error) {
      console.error(error, "error in add package");
      alert("Something went wrong while submitting the form.");
      return;
    }
  };

  const addCardDetail = () =>
    setCardDetails([...cardDetails, { product: "", quantity: "" }]);
  const addPackageDetail = () =>
    setPackageDetails([...packageDetails, { title: "", subtitles: [""] }]);
  const addBillDetail = () =>
    setBillDetails([...billDetails, { type: "", amount: "" }]);

  const addSubtitle = (index: number) => {
    const newPackageDetails = [...packageDetails];
    newPackageDetails[index].subtitles.push(""); // Add a new subtitle
    setPackageDetails(newPackageDetails);
  };

  const removeSubtitle = (index: number, subtitleIndex: number) => {
    const newPackageDetails = [...packageDetails];
    newPackageDetails[index].subtitles.splice(subtitleIndex, 1); // Remove a subtitle
    setPackageDetails(newPackageDetails);
  };

  const removeTitle = (index: number) => {
    const newPackageDetails = [...packageDetails];
    newPackageDetails.splice(index, 1); // Remove the title and its subtitles
    setPackageDetails(newPackageDetails);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setServices(res.data);
      } catch (error) {
        console.error(error, "error fetching services");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceName) {
      const fetchEvents = async () => {
        try {
          const serviceId = services.find(
            (service) => service.name === serviceName
          )?._id;
          if (serviceId) {
            const res = await axios.get(`${apiEndpoint}/services/${serviceId}`);
            setEvents(res.data.events);
          }
        } catch (error) {
          console.error(error, "error fetching events");
        }
      };
      fetchEvents();
    }
  }, [serviceName, services]);

  useEffect(() => {
    const getCategory = () => {
      const options: Record<string, string[]> = {
        Wedding: [
          "Silver Package",
          "Golden Package",
          "Platinum Package",
          "Platinum Live Package",
          "Signature Premium by Contrashutter",
        ],
        Corporate: [
          "Presento Package: Bussiness Overview",
          "Essential Coverage Shoot",
          "Premium Coverage Shoot",
          "Ultimate Event Coverage Shoot",
          "Product Launch Package 1: Launch Coverage Shoot",
          "Exhibition & Trade Show Package",
          "Award Ceremony Package",
          "Anniversary Event Package",
          "Add-On Options (For all Packages)",
        ],
        Birthday: [
          "KIDS BIRTHDAY SHOOT PACKAGES",
          "ADULTS BIRTHDAY SHOOT PACKAGES",
          "OLDER PERSONS BIRTHDAY SHOOT PACKAGES",
        ],
      };

      const cleanEventName = eventName.trim(); // Remove any extra spaces

      setCategory(options[cleanEventName] || []);
    };

    getCategory();
  }, [eventName]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Add Package</h1>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Package Name</label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Package Price</label>
            <input
              type="number"
              value={packagePrice}
              onChange={(e) => setPackagePrice(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Booking Price</label>
            <input
              type="number"
              value={bookingPrice}
              onChange={(e) => setBookingPrice(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium"> Category </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select Category</option>
              {category.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Select Service</label>
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            {services.map((service) => (
              <option key={service._id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Select Event</label>
          <select
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            {events?.map((event) => (
              <option key={event._id} value={event.eventName}>
                {event.eventName}
              </option>
            ))}
          </select>
        </div>

        {/* Card Details */}
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
                type="number"
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

        {/* Package Details */}
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
                  className="text-white bg-blue-500"
                  onClick={() => removeTitle(index)}
                >
                  X
                </Button>
              </div>
              {detail.subtitles.map((subtitle, subtitleIndex) => (
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
                    className="text-white bg-blue-500"
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

        {/* Bill Details */}
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
                type="number"
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
          className="mt-6 bg-green-500 hover:bg-green-600 text-white w-full"
        >
          Submit Package
        </Button>
      </div>
    </div>
  );
};

export default AddPackagePage;
