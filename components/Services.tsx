"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";

// Interface for service features/events
interface ServiceFeature {
  _id: string;
  name: string;
  eventName: string;
  image: string;
}

interface Service {
  _id: string;
  name: string;
  events: ServiceFeature[];
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fetch services from the backend
        const response = await axios.get(`${apiEndpoint}/services`);
        console.log(response.data);
        // For each service, fetch its events
        const servicesWithEvents = await Promise.all(
          response.data.map(async (service: Service) => {
            try {
              console.log(service.events);
              return {
                ...service,
                events: service.events || [],
              };
            } catch (error) {
              console.error(
                `Error fetching events for service ${service._id}:`,
                error
              );
              return {
                ...service,
                events: [],
              };
            }
          })
        );

        setServices(servicesWithEvents);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-8 px-[1em] lg:px-0">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="text-primaryBlue">Our</span>{" "}
          <span className="text-primaryOrange">Services</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We offer a comprehensive range of professional services to make your
          events memorable.
        </p>
      </div>

      {/* Services in alternating layout */}
      {services.map((service, index) => (
        <div
          key={service._id}
          className={`flex flex-col mx-[1em] ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } gap-8 items-center mb-10 md:h-[350px]`}
        >
          <div className="w-full md:w-1/2 relative h-[350px] md:h-full rounded-xl overflow-hidden">
            <Image
              src={
                service.events[0]?.image
                  ? service.events[0]?.image
                  : "/placeholder.svg"
              }
              alt={service.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-3xl font-bold text-white mb-2">
                {service.name}
              </h3>
              <Link href={`/services/${service._id}`}>
                <Button className="mt-4 bg-primaryOrange hover:bg-primaryOrange/90 text-white">
                  Explore {service.name}
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-fit md:h-full block">
            <div className="bg-primaryBlue/5 h-full dark:bg-primaryBlue/20 p-8 rounded-xl shadow-md border border-primaryBlue/20 flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-primaryOrange">
                {service.name} Services
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Professional {service.name.toLowerCase()} services for all your
                special occasions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[200px] pr-2">
                {service.events.map((event) => (
                  <div key={event._id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primaryOrange"></div>
                    <span>{event.eventName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Call to action */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to create memorable moments?
        </h3>
        <Link href="/contact">
          <Button className="bg-primaryBlue hover:bg-primaryBlue/90 text-white">
            Contact Us Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Services;
