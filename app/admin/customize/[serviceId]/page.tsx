"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { List, ListPlus, Pencil } from "lucide-react";
import Link from "next/link";
import { apiEndpoint, imageEndpoint } from "@/helper/api";
import Image from "next/image";
import SectionTitle from "@/components/custom/SectionTitle";
import { Badge } from "@/components/ui/badge";
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
    }
  };

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEventName(e.target.value);
  };

  const handleSubmitEventUpdate = async () => {
    if (editingEvent) {
      try {
        const formData = new FormData();
        formData.append("eventName", editedEventName);
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
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10  p-10">
      <SectionTitle title={`Customize ${service?.name} Events`} />
      {service ? (
        <div className="w-full p-6 bg-white ">
          {editingEvent ? (
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
              <h2 className="text-xl text-gray-700">
                <Link
                  href={`/admin/customize/${service._id}/${editingEvent._id}`}
                >
                  Editing Event: {editingEvent.eventName}
                </Link>
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={editedEventName}
                    onChange={handleEventNameChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 w-full"
                  />
                </div>

                <div className="mt-4">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-md h-auto rounded-lg shadow-md "
                      />
                    </>
                  ) : editingEvent?.image ? (
                    <>
                      <p className="text-sm text-gray-500 mb-2">
                        Current image URL: {getImageUrl(editingEvent.image)}
                      </p>
                      <Image
                        src={getImageUrl(editingEvent.image)}
                        alt="Current Event Image"
                        className="max-w-md h-auto rounded-lg shadow-md"
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                        }}
                      />
                    </>
                  ) : (
                    <p className="text-gray-500">No image uploaded</p>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSubmitEventUpdate}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Update Event
                  </button>
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              {service.events.map((event) => (
                <div
                  className="flex justify-between items-center p-2 gap-2 relative"
                  key={event._id}
                >
                  <Link href={`/admin/customize/${service._id}/${event._id}`}>
                    <Button variant="outline" className="relative">
                      {event.eventName}
                      <Badge
                        variant="outline"
                        className="px-1 py-1 cursor-pointer absolute right-[-0.5em] bottom-[-1em] bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          router.push(
                            `/admin/customize/${service._id}/${event._id}/form`
                          );
                        }}
                      >
                        {event?.formId ? (
                          <List className="text-[0.5rem]" />
                        ) : (
                          <ListPlus className="text-[0.5rem] " />
                        )}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-1 py-1 cursor-pointer absolute right-[-0.5em] top-[-1em] bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditEventToggle(event);
                        }}
                      >
                        <Pencil className="text-[0.5rem] " />
                      </Badge>
                    </Button>
                  </Link>
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
