"use client";
import { ServicePartnerType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Store from "@/helper/store";

const GetServicePartnerColumns = () => {
  const { updateStatus } = Store.useServicePartner();

  const ServicePartnerColumns: ColumnDef<ServicePartnerType>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        const servicePartner = row.original;

        const handleStatusUpdate = async (
          status: "Pending" | "Active" | "Inactive"
        ) => {
          if (servicePartner._id) {
            await updateStatus(servicePartner._id, status);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/admin/service-partners/${servicePartner._id}`}>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => handleStatusUpdate("Pending")}>
                Set Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate("Active")}>
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusUpdate("Inactive")}>
                Set Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: string = row.getValue("status");
        const color =
          status === "Pending"
            ? "text-orange-600"
            : status === "Active"
            ? "text-green-600"
            : "text-red-600";
        return <span className={color}>{status}</span>;
      },
    },
    {
      accessorKey: "registrationNumber",
      header: "Registration Number",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "businessAddress",
      header: "Business Address",
    },
    {
      accessorKey: "employees",
      header: "Employees",
    },
    {
      accessorKey: "experience",
      header: "Experience",
    },
    {
      accessorKey: "projects",
      header: "Projects",
    },
    {
      accessorKey: "bankName",
      header: "Bank Name",
    },
    {
      accessorKey: "accountNumber",
      header: "Account Number",
    },
    {
      accessorKey: "ifsc",
      header: "IFSC",
    },

    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
    },
  ];

  return ServicePartnerColumns;
};

export default GetServicePartnerColumns;
