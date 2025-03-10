"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiEndpoint } from "@/helper/api";
import Image from "next/image";
const AddEventPage = () => {
  const [eventName, setEventName] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [data, setData] = useState<Array<{ _id: string; name: string }>>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getServices();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !eventName) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("serviceId", serviceName);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(`${apiEndpoint}/events`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/admin/add-package");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Add Event</h1>
      <div className="flex space-x-4 p-6 bg-white rounded-lg shadow-md">
        {/* Select dropdown */}
        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="border p-2 rounded-md w-48"
        >
          <option value="">Select Service</option>
          {data.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>

        <Input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter Event Name"
          className="pl-3 border p-2 rounded-md"
        />
      </div>

      {/* Image upload input */}
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded-md"
        />

        {/* Display image preview if exists */}
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Image Preview"
              width={500}
              height={500}
              className=" object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
      >
        Submit
      </Button>
    </div>
  );
};

export default AddEventPage;
