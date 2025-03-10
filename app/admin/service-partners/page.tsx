"use client";
// Library Imports
import React, { useEffect } from "react";

// Project Imports
import { cn } from "@/lib/utils";
import Store from "@/helper/store";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import SectionTitle from "@/components/custom/SectionTitle";
import GetServicePartnerColumns from "@/components/columns/ServicePartnerColumns";

const ServicePartners = () => {
  const {
    filteredServicePartners,
    getAllServicePartners,
    activeTab,
    setActiveTab,
  } = Store.useServicePartner();

  useEffect(() => {
    getAllServicePartners();
  }, [getAllServicePartners]);

  const statusButtons = [
    { label: "Pending", value: "Pending" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const getActiveData = () => {
    switch (activeTab) {
      case "Pending":
        return filteredServicePartners.pending;
      case "Active":
        return filteredServicePartners.active;
      case "Inactive":
        return filteredServicePartners.inactive;
      default:
        return [];
    }
  };

  return (
    <div className="p-[2em]">
      <SectionTitle title="Service Partners" hideBackButton />

      <div className="flex gap-4 mb-6">
        {statusButtons.map((button) => (
          <Button
            key={button.value}
            onClick={() =>
              setActiveTab(button.value as "Pending" | "Active" | "Inactive")
            }
            variant={activeTab === button.value ? "default" : "outline"}
            className={cn("min-w-[100px]")}
          >
            {button.label}
          </Button>
        ))}
      </div>

      <DataTable columns={GetServicePartnerColumns()} data={getActiveData()} />
    </div>
  );
};

export default ServicePartners;
