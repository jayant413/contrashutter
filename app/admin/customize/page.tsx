"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { apiEndpoint } from "@/helper/api";
import SectionTitle from "@/components/custom/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Service {
  _id: string;
  name: string;
  events: unknown[];
}

const Customize = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setServices(res.data);
      } catch (error) {
        console.error(error, "error fetching services in admin");
      } finally {
      }
    };
    getServices();
  }, []);

  const handleSubmit = async () => {
    if (editingService) {
      try {
        const servicesToUpdate = [
          {
            _id: editingService._id,
            name: editedName,
          },
        ];

        const res = await axios.put(`${apiEndpoint}/services`, {
          servicesToUpdate,
        });

        if (res.status === 200) {
          toast.success("Service updated successfully");

          setServices((prevServices) =>
            prevServices.map((service) =>
              service._id === editingService._id
                ? { ...service, name: editedName }
                : service
            )
          );
          setEditingService(null);
        }
      } catch (error) {
        console.error(error, "error updating service in admin");
      }
    }
  };

  const handleEditToggle = (service: Service) => {
    if (editingService && editingService._id === service._id) {
      setEditingService(null);
    } else {
      setEditingService(service);
      setEditedName(service.name);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10  p-10">
      <SectionTitle title="Add New" hideBackButton />
      <div className="flex space-x-4 mb-6">
        <Button variant="outline">
          <Link href="/admin/add-service">Add Service</Link>
        </Button>
        <Button variant="outline">
          <Link href="/admin/add-event">Add Event</Link>
        </Button>
        <Button variant="outline">
          <Link href="/admin/add-package">Add Package</Link>
        </Button>
      </div>

      <div className="w-full  p-6 bg-white rounded-lg  ">
        <SectionTitle
          title={`Services${
            editingService ? ` - Editing: ${editingService.name}` : ""
          }`}
          hideBackButton
        />
        {editingService ? (
          <div className="space-y-4 flex items-center flex-col justify-center">
            <Link href={`/admin/customize/${editingService._id}`}>
              {editingService.name}
            </Link>

            <div className="flex space-x-4">
              <Input
                type="text"
                value={editedName}
                onChange={handleNameChange}
                className=" w-fit"
                placeholder="Enter service name"
              />

              <Button onClick={() => setEditingService(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Update</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            {services.map((service) => (
              <div
                className="flex justify-between items-center p-2 gap-2 relative"
                key={service._id}
              >
                <Link href={`/admin/customize/${service._id}`}>
                  <Button variant="outline" className="relative">
                    {service.name}
                    <Badge
                      variant="outline"
                      className="px-1 py-1 cursor-pointer absolute right-[-0.5em] top-[-1em] bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditToggle(service);
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
    </div>
  );
};

export default Customize;
