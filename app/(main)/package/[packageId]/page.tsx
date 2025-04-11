"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Store from "@/helper/store";
import PackageDetails from "@/components/pages/package/PackageDetails";

const PackageDetailsPage = () => {
  const { packageId } = useParams();
  const { getPackage, activePackage } = Store.usePackage();
  const { activeEvent, setActiveEvent } = Store.useEvent();
  const { setActiveService } = Store.useService();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToWishlist, user, removeFromWishlist } = Store.useAuth();

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

  const handleWishlistToggle = () => {
    if (!user) {
      router.push("/login");
      toast.error("Please login to add in wishlist");
      return;
    }
    if (activePackage && activePackage._id) {
      if (isWishlisted) {
        removeFromWishlist(activePackage._id);
        setIsWishlisted(false);
      } else {
        addToWishlist(activePackage._id);
        setIsWishlisted(true);
      }
    }
  };

  useEffect(() => {
    if (user && activePackage?._id) {
      const wishlisted = user.wishlist.find(
        (packageInfo) => packageInfo._id === activePackage._id
      );
      setIsWishlisted(!!wishlisted);
    }
  }, [user, activePackage]);

  if (!activePackage || !activePackage._id) {
    return (
      <div className="flex flex-col space-y-[2em] justify-center items-center h-[90vh]">
        <Skeleton className="w-[60vw] h-[10vh] " />
        <Skeleton className="w-[60vw] h-[50vh] " />
        <Skeleton className="w-[10vw] h-[5vh]  place-self-end mr-[10em]" />
      </div>
    );
  }

  return (
    <div className="px-[2em] py-8">
      <PackageDetails
        packageData={activePackage}
        eventName={activeEvent?.eventName}
        onWishlistToggle={handleWishlistToggle}
        isWishlisted={isWishlisted}
      />
    </div>
  );
};

export default PackageDetailsPage;
