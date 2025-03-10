"use client";
import { useEffect } from "react";
import { BookingForm } from "@/components/form-sections/boooking";
import Store from "@/helper/store";
import { useParams } from "next/navigation";

const PackageBooking = () => {
  const { packageId } = useParams();
  const { getPackage, activePackage } = Store.usePackage();
  const { setActiveEvent } = Store.useEvent();
  const { setActiveService } = Store.useService();

  useEffect(() => {
    if (packageId) {
      getPackage(packageId as string);
    }
  }, [packageId, getPackage]);

  useEffect(() => {
    if (activePackage) {
      setActiveEvent(activePackage.eventId);
      setActiveService(activePackage.serviceId);
    }
  }, [activePackage, setActiveEvent, setActiveService]);
  return <BookingForm />;
};

export default PackageBooking;
