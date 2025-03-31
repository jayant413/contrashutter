"use client";
// Library Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { websiteUrl } from "@/helper/api";
import SectionTitle from "@/components/custom/SectionTitle";

const WhishList = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageType[] | null>(null);
  const { user, removeFromWishlist } = Store.useAuth();
  const { allServices } = Store.useService();

  useEffect(() => {
    if (user) {
      setPackages(user?.wishlist);
    }
  }, [user]);

  return (
    <div className=" mx-auto p-8">
      <SectionTitle title={`Wishlist`} hideBackButton />

      {packages ? (
        packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.map((pkg, index) => (
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
                      Book Now
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full hover:bg-primaryBlue hover:text-white"
                    title="Add to Cart"
                    onClick={() => {
                      if (user && pkg._id) {
                        removeFromWishlist(pkg._id);
                      } else {
                        router.push("/login");
                        toast.error("Please login to add in wishlist");
                      }
                    }}
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className=" text-center text-gray-600 text-[2rem]  h-[10em] flex flex-col space-y-[2em] items-center justify-center">
            No packages found in wishlist
            <Link
              href={`${allServices ? `/services/${allServices[0]._id}` : "/"}`}
              className="text-primaryBlue"
            >
              <Button variant="primaryBlue">Add Now To Wishlist</Button>
            </Link>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton className="w-full h-[25em]" key={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WhishList;
