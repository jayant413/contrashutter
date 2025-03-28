"use client";
import {
  Copy,
  Heart,
  Share,
  ArrowLeft,
  FileText,
  ListCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PackageType } from "@/types";
import { websiteUrl } from "@/helper/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface PackageDetailsProps {
  packageData: PackageType;
  eventName?: string;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}

export default function PackageDetails({
  packageData,
  eventName,
  onWishlistToggle,
  isWishlisted = false,
}: PackageDetailsProps) {
  const router = useRouter();

  const handleShare = async () => {
    if (!packageData._id) return;

    const url = `${websiteUrl}/package/${packageData._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData.name,
          text: `Check out this ${packageData.name} package on Contrashutter!`,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Error sharing the link");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleCopyLink = () => {
    if (!packageData._id) return;

    const url = `${websiteUrl}/package/${packageData._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {eventName ? `${eventName} : ${packageData.name}` : packageData.name}
        </h1>
        <div className="text-3xl font-bold text-primaryOrange">
          ₹{packageData.price.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button
          onClick={handleShare}
          className="bg-primaryBlue hover:bg-primaryBlue/90"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
        <Button
          variant={isWishlisted ? "default" : "outline"}
          onClick={onWishlistToggle}
          className={isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <Heart
            className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-white" : ""}`}
          />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </Button>
        <Button variant="outline" disabled>
          <FileText className="mr-2 h-4 w-4" /> Get Quotation
        </Button>{" "}
        {packageData._id && (
          <Link href={`/package/${packageData._id}/booking`}>
            <Button className="bg-primaryBlue hover:bg-primaryBlue/90 ">
              <ListCheck className="mr-2 h-4 w-4" /> Book Now
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {packageData.package_details &&
          packageData.package_details.length > 0 && (
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-primaryOrange">
                  Package Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {packageData.package_details.map((detail, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-medium text-primaryBlue mb-2">
                        {detail.title}
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {detail.subtitles.map((subtitle, subIndex) => (
                          <li key={subIndex} className="text-gray-600">
                            {subtitle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {packageData.card_details && packageData.card_details.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primaryOrange">
                What&apos;s Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {packageData.card_details.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>
                      {item.product_name} ({item.quantity})
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {packageData.bill_details && packageData.bill_details.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primaryOrange">Bill Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packageData.bill_details.map((bill, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{bill.type}</span>
                    <span className="font-medium">
                      ₹{bill.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
