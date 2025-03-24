"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import birth from "@/public/photography/birthday.jpeg"; // Local birthday image
import corporate from "@/public/photography/corporate.jpeg"; // Local corporate image
import wedding from "@/public/photography/wedding.jpeg"; // Local wedding image

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Store from "@/helper/store";
import { EventType } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { imageEndpoint } from "@/helper/api";

const EventsPage = () => {
  const { serviceId } = useParams();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const { activeService, getService } = Store.useService();
  const { getEvent } = Store.useEvent();
  const { isShowSidebar } = Store.useMain();

  useEffect(() => {
    if (activeService) {
      setEvents(activeService.events);
    }
  }, [activeService]);

  useEffect(() => {
    if (serviceId) {
      getService(serviceId as string);
    }
  }, [serviceId, getService]);

  const images = [corporate, birth, wedding]; // Array of images

  return (
    <div className="mx-auto bg-white overflow-hidden my-3 p-6 min-h-[70vh]">
      {events ? (
        events.length === 0 ? (
          <p className="text-center text-lg font-semibold">
            No events available
          </p>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2  gap-8 mt-4 w-full ${
              isShowSidebar
                ? "lg:grid-cols-2  xl:grid-cols-3"
                : "lg:grid-cols-3  xl:grid-cols-4"
            }`}
          >
            {events.map((event, index) => (
              <Card
                key={event._id}
                className="overflow-hidden shadow-lg transition-transform transform duration-200 hover:scale-105"
              >
                <CardHeader className="bg-gradient-to-br from-primaryBlue to-primaryOrange/50 p-4">
                  <CardTitle className="text-center text-white text-xl font-bold">
                    {event.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-44 bg-white flex items-center justify-center rounded-md shadow-md overflow-hidden">
                    <Image
                      className="h-full w-full object-cover"
                      src={
                        event.image
                          ? `${imageEndpoint}/${event.image}`
                          : images[index] || birth
                      } // Use images based on index
                      alt={event.eventName}
                      width={300}
                      height={176}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-6">
                  <Link
                    href={`/event/${event._id}`}
                    onClick={() => getEvent(event._id as string)}
                  >
                    <Button
                      variant="outline"
                      className="hover:bg-primaryBlue hover:text-white transition-colors"
                    >
                      View Packages
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-[20em] rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
