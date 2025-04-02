"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiEndpoint } from "@/helper/api";
import Image from "next/image";
import { toast } from "sonner";

const AddEventPage = () => {
  const [eventName, setEventName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("serviceId", serviceName);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(`${apiEndpoint}/events`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Event created successfully");
      router.push("/admin/add-package");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Add Event</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select Service</option>
            {data.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Name</label>
          <Input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter Event Name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description (optional)"
            className="w-full min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Display image preview if exists */}
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Image Preview"
              width={500}
              height={300}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default AddEventPage;
