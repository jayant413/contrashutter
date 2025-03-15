"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Store from "@/helper/store";
import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/custom/SectionTitle";
import Link from "next/link";

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
        <>
          <SectionTitle
            title="Join the Service Partner Program"
            hideBackButton
          />
          <p className="text-lg text-gray-700 text-center">
            Grow your business by partnering with us. Sign up today!
          </p>
          <Link href="/partner/partner-program/join-partner-program">
            <Button variant="primaryBlue" className="mt-4 px-6 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </>
      );
    }

    const commonDetails = (
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Business Name</h3>
          <p>{servicePartner?.name}</p>
        </div>
        <div>
          <h3 className="font-semibold">Registration Number</h3>
          <p>{servicePartner?.registrationNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold">Contact Person</h3>
          <p>{servicePartner?.contactPerson}</p>
        </div>
        <div>
          <h3 className="font-semibold">Contact Number</h3>
          <p>{servicePartner?.contactNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold">Email</h3>
          <p>{servicePartner?.email}</p>
        </div>
        <div>
          <h3 className="font-semibold">Business Address</h3>
          <p>{servicePartner?.businessAddress}</p>
        </div>
        <div>
          <h3 className="font-semibold">Employees</h3>
          <p>{servicePartner?.employees}</p>
        </div>
        <div>
          <h3 className="font-semibold">Experience</h3>
          <p>{servicePartner?.experience}</p>
        </div>
        <div>
          <h3 className="font-semibold">Projects</h3>
          <p>{servicePartner?.projects}</p>
        </div>
        <div>
          <h3 className="font-semibold">Bank Name</h3>
          <p>{servicePartner?.bankName}</p>
        </div>
        <div>
          <h3 className="font-semibold">Account Number</h3>
          <p>{servicePartner?.accountNumber}</p>
        </div>
        <div>
          <h3 className="font-semibold">IFSC</h3>
          <p>{servicePartner?.ifsc}</p>
        </div>
      </div>
    );

    if (user?.status === "Pending") {
      return (
        <>
          <SectionTitle title="Application Under Review" hideBackButton />
          {servicePartner && (
            <Card className="w-full max-w-2xl">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="text-lg text-yellow-600 mb-4">
                    Your application is pending approval. Here are your
                    submitted details:
                  </div>
                  {commonDetails}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      );
    }

    if (user?.status === "Active") {
      return (
        <>
          <SectionTitle
            title="Welcome to the Partner Program!"
            hideBackButton
          />
          {servicePartner && (
            <Card className="w-full max-w-2xl">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="text-lg text-green-600 mb-4">
                    Your account is active. Here are your business details:
                  </div>
                  {commonDetails}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      );
    }

    if (user?.status === "Inactive") {
      return (
        <>
          <SectionTitle title="Account Inactive" hideBackButton />
          <div className="text-lg text-red-600">
            Your account is currently inactive. Please contact support for
            assistance.
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 p-6">
      {renderContent()}
    </div>
  );
};

export default Partner;
