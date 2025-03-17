"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter

// Project Imports
import { CardDetailType, PackageDetailType, BillDetailType } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Store from "@/helper/store";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { websiteUrl } from "@/helper/api";
import { toast } from "sonner";
import SectionTitle from "@/components/custom/SectionTitle";

const PackageDetails = () => {
  const { packageId } = useParams();
  const { getPackage, activePackage } = Store.usePackage();
  const { activeEvent, setActiveEvent } = Store.useEvent();
  const { setActiveService } = Store.useService();
  const { user } = Store.useAuth();
  const router = useRouter();

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

  if (!activePackage) {
    return (
      <div className="flex flex-col space-y-[2em] justify-center items-center h-[90vh]">
        <Skeleton className="w-[60vw] h-[10vh] " />
        <Skeleton className="w-[60vw] h-[50vh] " />
        <Skeleton className="w-[10vw] h-[5vh]  place-self-end mr-[10em]" />
      </div>
    );
  }

  return (
    <div className="  px-[2em] py-8">
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <SectionTitle
            title={`${activeEvent?.eventName} : ${activePackage.name}`}
          />

          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-lg">
              ₹{activePackage.price.toLocaleString()}
            </Badge>
            {activePackage.booking_price && (
              <Badge variant="outline" className="text-lg">
                Booking: ₹{activePackage.booking_price.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Card Details Section */}
        {activePackage.card_details &&
          activePackage.card_details.length > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePackage.card_details.map(
                  (card: CardDetailType, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">
                        {card.product_name}{" "}
                        {card.quantity > 1 && `(${card.quantity})`}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}

        {/* Package Details Section */}
        {activePackage.package_details &&
          activePackage.package_details.length > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Package Details</h2>
              <div className="space-y-6">
                {activePackage.package_details.map(
                  (detail: PackageDetailType, index: number) => (
                    <div key={index}>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {detail.title}
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {detail.subtitles.map(
                          (subtitle: string, subIndex: number) => (
                            <li key={subIndex} className="text-gray-600">
                              {subtitle}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}

        {/* Bill Details Section */}
        {activePackage.bill_details &&
          activePackage.bill_details.length > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Bill Details</h2>
              <div className="space-y-4">
                {activePackage.bill_details.map(
                  (bill: BillDetailType, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">{bill.type}</span>
                      <span className="font-medium">
                        ₹{bill.amount.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href={`/package/${activePackage._id}/booking`}>
            <Button
              variant="outline"
              onClick={() => {
                if (!user) {
                  toast.error("Please login to book");
                }
              }}
              className=" bg-primaryBlue hover:bg-primaryBlue text-white hover:text-white hover:opacity-80"
            >
              Book Now
            </Button>
          </Link>

          <Button
            variant="outline"
            disabled
            className=" bg-primaryBlue hover:bg-primaryBlue text-white hover:text-white hover:opacity-80"
          >
            Get Quotation
          </Button>
          <Button
            variant="outline"
            className=" bg-primaryBlue hover:bg-primaryBlue text-white hover:text-white hover:opacity-80"
            onClick={() => {
              if (user) {
                // addToWhishlist(activePackage._id);
              } else {
                router.push("/sign-in");
                toast.error("Please login to add in wishlist");
              }
            }}
          >
            Add to Whislist
          </Button>
          <Button
            variant="outline"
            className=" bg-primaryBlue hover:bg-primaryBlue text-white hover:text-white hover:opacity-80"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: activePackage.name,
                    url: `${websiteUrl}/package/${activePackage._id}`,
                  })
                  .catch(() => toast.error("Error sharing the link"));
              } else {
                navigator.clipboard.writeText(
                  `${websiteUrl}/package/${activePackage._id}`
                );
                toast.success("Link copied ");
              }
            }}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
