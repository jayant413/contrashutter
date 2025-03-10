"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import birth from "@/public/photography/birthday.jpeg";

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

  return (
    <div className="max-w-6xl mx-auto bg-white overflow-hidden my-3 p-6 min-h-[70vh]">
      {events ? (
        events?.length === 0 ? (
          <p className="text-center">No events available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {events?.map((event) => (
              <Card key={event._id} className="overflow-hidden">
                <CardHeader className="bg-blue-200">
                  <CardTitle className="text-center">
                    {event.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-44 bg-white flex items-center justify-center rounded-sm">
                    <Image
                      className="h-44 w-auto object-cover rounded-md"
                      src={
                        event.image ? `${imageEndpoint}/${event.image}` : birth
                      }
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
                    <Button variant="outline"> View Packages</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className=" h-[20em] rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
