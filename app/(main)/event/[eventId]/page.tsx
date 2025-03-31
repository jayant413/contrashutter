"use client";
// Library Imports
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import { Heart, Link2, ListCheck, FileText, ExternalLink } from "lucide-react";

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
import { cn } from "@/lib/utils";

const PackagesPage = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const [packages, setPackages] = useState<PackageType[] | null>(null);

  const { user } = Store.useAuth();
  const { getService } = Store.useService();
  const { activeEvent, getEvent } = Store.useEvent();
  const { addToWishlist, removeFromWishlist } = Store.useAuth();
  const { isShowSidebar } = Store.useMain();

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
    <div className=" mx-auto p-8 ">
      <SectionTitle title={`${activeEvent?.eventName} Packages`} />

      <div
        className={`grid grid-cols-1 sm:grid-cols-2  gap-6 ${
          isShowSidebar
            ? "lg:grid-cols-2  xl:grid-cols-3"
            : "lg:grid-cols-3  xl:grid-cols-4"
        }`}
      >
        {packages
          ? packages?.map((pkg, index) => (
              <Card
                key={index}
                className="relative flex flex-col justify-between"
              >
                <CardHeader className="space-y-0 pb-2">
                  <CardTitle className="text-gray-800 text-md line-clamp-1">
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

                  <div className="space-y-2 h-[10em] overflow-y-auto">
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
                      className="w-full hover:bg-primaryBlue hover:text-white flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primaryBlue hover:text-white"
                    disabled
                  >
                    <FileText className="mr-2 h-4 w-4" /> Get Quotation
                  </Button>
                  <Link
                    href={!user ? "/login" : `/package/${pkg._id}/booking`}
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
                      <ListCheck className="mr-2 h-4 w-4" /> Book Now
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full  hover:text-white",
                      user?.wishlist.find(
                        (packageInfo) => packageInfo._id === pkg._id
                      )
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "hover:bg-primaryBlue"
                    )}
                    title="Add to Cart"
                    onClick={() => {
                      if (user && pkg._id) {
                        if (
                          user?.wishlist.find(
                            (packageInfo) => packageInfo._id === pkg._id
                          )
                        ) {
                          removeFromWishlist(pkg._id);
                        } else {
                          addToWishlist(pkg._id);
                        }
                      } else {
                        router.push("/login");
                        toast.error("Please login to add in wishlist");
                      }
                    }}
                  >
                    {user?.wishlist.find(
                      (packageInfo) => packageInfo._id === pkg._id
                    ) ? (
                      <span className="text-white flex items-center">
                        {" "}
                        <Heart className={`mr-2 h-4 w-4 fill-white`} />{" "}
                        Wishlisted
                      </span>
                    ) : (
                      <span className=" flex items-center">
                        {" "}
                        <Heart className={`mr-2 h-4 w-4`} /> Add To Wishlist
                      </span>
                    )}
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
