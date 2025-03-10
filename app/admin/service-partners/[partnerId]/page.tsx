"use client";
import Store from "@/helper/store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import SectionTitle from "@/components/custom/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";

const ServicePartnerDetails = () => {
  const { partnerId } = useParams();
  const { getServicePartnerById, servicePartner } = Store.useServicePartner();

  useEffect(() => {
    if (partnerId) {
      getServicePartnerById(partnerId as string);
    }
  }, [getServicePartnerById, partnerId]);

  return (
    <div className="p-[2em] space-y-6">
      <SectionTitle title="Service Partner Details" />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Name</h3>
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
              <h3 className="font-semibold">Status</h3>
              <p>{servicePartner?.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Bank Details</h3>
              <p>Bank: {servicePartner?.bankName}</p>
              <p>Account: {servicePartner?.accountNumber}</p>
              <p>IFSC: {servicePartner?.ifsc}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePartnerDetails;
