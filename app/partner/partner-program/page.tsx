"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Store from "@/helper/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Handshake } from "lucide-react";

const Partner = () => {
  const { user } = Store.useAuth();
  const { getServicePartnerByPartnerId, servicePartner } =
    Store.useServicePartner();

  useEffect(() => {
    if (user?._id && user?.status !== undefined) {
      getServicePartnerByPartnerId(user._id);
    }
  }, [user, getServicePartnerByPartnerId]);

  const renderContent = () => {
    if (!user?.status && user?.role === "Service Provider") {
      return (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Handshake className="h-12 w-12 text-primaryOrange" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-primaryBlue">
                Join the Service Partner Program
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Grow your business by partnering with us. Sign up today!
              </p>
              <div className="pt-4">
                <Link href="/partner/partner-program/join-partner-program">
                  <Button className="bg-primaryOrange hover:bg-primaryOrange/80 text-white px-8 py-6 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-primaryBlue">
                    Increased Visibility
                  </h3>
                  <p className="text-gray-600">
                    Get featured on our platform and reach thousands of
                    potential clients.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-primaryBlue">
                    Higher Earnings
                  </h3>
                  <p className="text-gray-600">
                    Earn competitive commissions on every booking through our
                    platform.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2 text-primaryBlue">
                    Professional Growth
                  </h3>
                  <p className="text-gray-600">
                    Access training, resources, and networking opportunities.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    const commonDetails = (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-500">Business Name</h3>
          <p className="font-medium">{servicePartner?.name}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Registration Number</h3>
          <p className="font-medium">{servicePartner?.registrationNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Contact Person</h3>
          <p className="font-medium">{servicePartner?.contactPerson}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Contact Number</h3>
          <p className="font-medium">{servicePartner?.contactNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Email</h3>
          <p className="font-medium">{servicePartner?.email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Business Address</h3>
          <p className="font-medium">{servicePartner?.businessAddress}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Employees</h3>
          <p className="font-medium">{servicePartner?.employees}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Experience</h3>
          <p className="font-medium">{servicePartner?.experience}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Projects</h3>
          <p className="font-medium">{servicePartner?.projects}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Bank Name</h3>
          <p className="font-medium">{servicePartner?.bankName}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">Account Number</h3>
          <p className="font-medium">{servicePartner?.accountNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500">IFSC</h3>
          <p className="font-medium">{servicePartner?.ifsc}</p>
        </div>
      </div>
    );

    if (user?.status === "Pending") {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Partner Program
          </h1>
          <Card>
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-xl">
                Application Under Review
              </CardTitle>
              <CardDescription>
                Your application is pending approval from our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {servicePartner && (
                <div className="grid gap-6">
                  <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-200">
                    Your application is currently under review. We&apos;ll
                    notify you once it&apos;s approved.
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Submitted Details
                    </h3>
                    {commonDetails}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (user?.status === "Active") {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Partner Program
          </h1>
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-xl">
                Welcome to the Partner Program!
              </CardTitle>
              <CardDescription>
                Your application has been approved. You are now an active
                partner.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {servicePartner && (
                <div className="grid gap-6">
                  <div className="p-4 bg-green-50 rounded-lg text-green-800 border border-green-200">
                    Your account is active. You can now access all partner
                    features and benefits.
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-primaryBlue">
                      Business Details
                    </h3>
                    {commonDetails}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (user?.status === "Inactive") {
      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Partner Program
          </h1>
          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-xl">Account Inactive</CardTitle>
              <CardDescription>
                Your account is currently inactive.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="p-4 bg-red-50 rounded-lg text-red-800 border border-red-200">
                Your account is currently inactive. Please contact support for
                assistance.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return <div className="container mx-auto px-4 py-8">{renderContent()}</div>;
};

export default Partner;
