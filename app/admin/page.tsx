"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { apiEndpoint } from "@/helper/api";

interface Service {
  _id: string;
  name: string;
  events: unknown[];
}

const AdminPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editableServices, setEditableServices] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const credentials = {
    username: "admin",
    password: "123456",
  };

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiEndpoint}/services`);
        setServices(res.data);
      } catch (error) {
        console.error(error, "error fetching services in admin");
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  const handleChange = (value: string, id: string) => {
    const newServices = services.map((service) => {
      if (service._id === id) {
        return { ...service, name: value };
      }
      return service;
    });
    setServices(newServices);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const servicesToUpdate = services.map((service) => ({
        _id: service._id,
        name: service.name,
      }));

      const res = await axios.put(`${apiEndpoint}/services`, {
        servicesToUpdate,
      });

      if (res.status === 200) {
        alert("Services updated successfully");
      }
    } catch (error) {
      console.error(error, "error updating services in admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = (id: string) => {
    setEditableServices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const username = formData.get("username")?.toString() || "";
      const password = formData.get("password")?.toString() || "";

      if (
        username === credentials.username &&
        password === credentials.password
      ) {
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col items-center min-h-screen py-10 bg-gray-100">
          <div className="flex space-x-4 mb-6">
            <Button className="bg-gray-300 hover:bg-blue-400">
              <Link href="/admin/add-service">Add Service</Link>
            </Button>
            <Button className="bg-gray-300 hover:bg-blue-400">
              <Link href="/admin/add-event">Add Event</Link>
            </Button>
            <Button className="bg-gray-300 hover:bg-blue-400">
              <Link href="/admin/add-package">Add Package</Link>
            </Button>
          </div>

          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Services</h1>
            {services.map((service) => (
              <div
                className="flex justify-between items-center p-2 gap-2"
                key={service._id}
              >
                <input
                  className="w-full p-2 bg-white rounded-md border border-gray-300"
                  type="text"
                  value={service.name}
                  onChange={(e) => handleChange(e.target.value, service._id)}
                  disabled={!editableServices[service._id]}
                />
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleEditToggle(service._id)}
                >
                  <Pencil size={17} />
                </span>
              </div>
            ))}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-10 min-h-screen bg-gray-100">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
          >
            <h1 className="mb-4 text-2xl font-bold text-gray-900 text-center">
              Admin Login
            </h1>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminPage;
