"use client";
// Library Imports
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import { Link2 } from "lucide-react";

// Project Imports
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Store from "@/helper/store";
import { PackageType } from "@/types";
import { Button } from "@/components/ui/button";
import { websiteUrl } from "@/helper/api";
import SectionTitle from "@/components/custom/SectionTitle";

const PackagesPage = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const [packages, setPackages] = useState<PackageType[] | null>(null);

  const { user } = Store.useAuth();
  const { getService } = Store.useService();
  const { activeEvent, getEvent } = Store.useEvent();
  const { addToWishlist } = Store.useAuth();

  useEffect(() => {
    if (eventId) {
      getEvent(eventId as string);
    }
  }, [getEvent, eventId]);

  useEffect(() => {
    if (activeEvent) {
      getService(activeEvent?.serviceId);
      setPackages(activeEvent?.packageIds);
    }
  }, [activeEvent, getService]);

  return (
    <div className="container mx-auto p-8">
      <SectionTitle title={`${activeEvent?.eventName} Packages`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages
          ? packages?.map((pkg, index) => (
              <Card key={index} className="relative">
                <CardHeader className="space-y-0 pb-2">
                  <CardTitle className="text-gray-800 text-md">
                    {pkg.name}
                  </CardTitle>
                  <span
                    title="Share"
                    className="cursor-pointer absolute top-4 right-12"
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: pkg.name,
                            url: `${websiteUrl}/package/${pkg._id}`,
                          })
                          .catch(() => toast.error("Error sharing the link"));
                      } else {
                        navigator.clipboard.writeText(
                          `${websiteUrl}/package/${pkg._id}`
                        );
                        toast.success("Link copied ");
                      }
                    }}
                  >
                    <FiShare2 />
                  </span>
                  <span
                    title="Copy Link"
                    className="cursor-pointer absolute top-4 right-3"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${websiteUrl}/package/${pkg._id}`
                      );
                      toast.success("Link copied ");
                    }}
                  >
                    <Link2 className="w-4 h-4" />
                  </span>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-bold">Name</span>
                      <span className="text-gray-700 font-bold">Quantity</span>
                    </div>
                    {pkg.card_details && pkg.card_details.length > 0 ? (
                      pkg.card_details.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-700">
                            {item.product_name}
                          </span>
                          <span className="text-gray-700">{item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No card details available</p>
                    )}
                  </div>

                  <Separator className="bg-gray-200 h-[1px]" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">
                      Total
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      ₹{pkg.price}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/package/${pkg._id}`}
                    title="View Details"
                    className="w-full flex justify-end"
                  >
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primaryBlue hover:text-white"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primaryBlue hover:text-white"
                    disabled
                  >
                    Get Quotation
                  </Button>
                  <Link
                    href={!user ? "/sign-in" : `/package/${pkg._id}/booking`}
                    className="w-full flex justify-end"
                    onClick={() => {
                      if (!user) {
                        toast.error("Please login to book");
                      }
                    }}
                  >
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primaryBlue hover:text-white"
                    >
                      Book Now
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full hover:bg-primaryBlue hover:text-white"
                    title="Add to Cart"
                    onClick={() => {
                      if (user && pkg._id) {
                        addToWishlist(pkg._id);
                      } else {
                        router.push("/sign-in");
                        toast.error("Please login to add in wishlist");
                      }
                    }}
                  >
                    Add To Wishlist
                  </Button>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
};

export default PackagesPage;
