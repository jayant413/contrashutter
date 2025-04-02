"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Store from "@/helper/store";
import { EventType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/event-card";

const EventsPage = () => {
  const { serviceId } = useParams();
  const [events, setEvents] = useState<EventType[] | null>(null);
  const { activeService, getService } = Store.useService();
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
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
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
