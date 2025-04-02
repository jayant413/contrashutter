"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { List, ListPlus, Pencil } from "lucide-react";
import Link from "next/link";
import { apiEndpoint, imageEndpoint } from "@/helper/api";
import Image from "next/image";
import SectionTitle from "@/components/custom/SectionTitle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ServiceType, EventType } from "@/types";
import { useRouter } from "next/navigation";
const CustomizeServicePage = ({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) => {
  const [service, setService] = useState<ServiceType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [editedEventName, setEditedEventName] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { serviceId } = await params;
        const res = await axios.get(`${apiEndpoint}/services/${serviceId}`);
        setService(res.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [params]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    // If it's already a full URL (Cloudinary), return it as is
    if (imagePath.startsWith("http")) return imagePath;
    // Otherwise treat it as a local path
    const cleanPath = imagePath.replace(/^\/+/, "").replace(/\\/g, "/");
    return `${imageEndpoint}/${cleanPath}`;
  };

  useEffect(() => {
    const getEventImage = async () => {
      try {
        if (editingEvent?.image) {
          const imageUrl = getImageUrl(editingEvent.image);
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error("Error setting event image:", error);
      }
    };
    if (editingEvent) {
      getEventImage();
    }
  }, [editingEvent]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleEditEventToggle = (event: EventType) => {
    if (editingEvent && editingEvent._id === event._id) {
      setEditingEvent(null);
    } else {
      setEditingEvent(event);
      setEditedEventName(event.eventName);
      setEditedDescription(event.description || "");
    }
  };

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEventName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedDescription(e.target.value);
  };

  const handleSubmitEventUpdate = async () => {
    if (editingEvent) {
      try {
        const formData = new FormData();
        formData.append("eventName", editedEventName);
        formData.append("description", editedDescription);
        if (image) {
          formData.append("image", image);
        }

        const res = await axios.put(
          `${apiEndpoint}/events/${editingEvent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200) {
          toast.success("Event updated successfully");

          setService((prevService) => {
            if (!prevService) return prevService;

            const updatedEvents = prevService.events.map((event) =>
              event._id === editingEvent._id
                ? {
                    ...event,
                    eventName: editedEventName,
                    description: editedDescription,
                    image: res.data.event.image,
                  }
                : event
            );
            return { ...prevService, events: updatedEvents };
          });

          setEditingEvent(null);
          setImage(null);
          setImagePreview("");
        }
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10  p-10">
      <SectionTitle title={`Customize ${service?.name} Events`} />
      {service ? (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm">
          {editingEvent ? (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {service.name}
                </h1>
                <span className="text-gray-400">›</span>
                <h2 className="text-xl text-gray-600">
                  {editingEvent.eventName}
                </h2>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={editedEventName}
                      onChange={handleEventNameChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="row-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="event-image"
                      />
                      <label htmlFor="event-image" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="p-2 rounded-full bg-blue-50">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-500"
                            >
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                              <line x1="16" y1="5" x2="22" y2="5"></line>
                              <line x1="19" y1="2" x2="19" y2="8"></line>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-500">
                            Click to browse or drag an image
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editedDescription}
                      onChange={handleDescriptionChange}
                      className="w-full p-2 border border-gray-300 rounded-md min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter event description (optional)"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {(imagePreview || editingEvent?.image) && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </h3>
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={
                          imagePreview ||
                          (editingEvent?.image
                            ? getImageUrl(editingEvent.image)
                            : "")
                        }
                        alt="Event Image"
                        width={400}
                        height={200}
                        className="w-full h-48 object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setEditingEvent(null);
                      setImage(null);
                      setImagePreview("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitEventUpdate} size="sm">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {service.events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-36 w-full overflow-hidden rounded-t-lg bg-gray-100">
                    {event.image ? (
                      <Image
                        src={getImageUrl(event.image)}
                        alt={event.eventName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {event.eventName}
                    </h3>
                    {event.description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      <Link
                        href={`/admin/customize/${service._id}/${event._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Packages
                      </Link>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() =>
                            router.push(
                              `/admin/customize/${service._id}/${event._id}/form`
                            )
                          }
                        >
                          {event?.formId ? (
                            <List className="h-4 w-4" />
                          ) : (
                            <ListPlus className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => handleEditEventToggle(event)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Service not found</p>
      )}
    </div>
  );
};

export default CustomizeServicePage;
