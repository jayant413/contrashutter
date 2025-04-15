"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import Store from "@/helper/store";
import { ServicePartnerType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ServicePartnersTable({
  servicePartners,
}: {
  servicePartners: ServicePartnerType[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { updateStatus } = Store.useServicePartner();

  const filteredServicePartners = servicePartners.filter(
    (partner) =>
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (
    partnerId: string | undefined,
    status: "Pending" | "Active" | "Inactive"
  ) => {
    if (partnerId) {
      await updateStatus(partnerId, status);
    }
  };

  return (
    <div className="md:mx-auto py-8">
      <Card>
        <CardHeader className="bg-primaryBlue/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Service Partners
              </CardTitle>
              <CardDescription>
                View and manage all service partners
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search service partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryBlue/5 hover:bg-primaryBlue/10">
                  <TableHead className="font-medium">Actions</TableHead>
                  <TableHead className="font-medium">Business Name</TableHead>
                  <TableHead className="font-medium">
                    Registration no.
                  </TableHead>
                  <TableHead className="font-medium">Email</TableHead>
                  <TableHead className="font-medium">Contact person</TableHead>
                  <TableHead className="font-medium">Contact</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Employees</TableHead>
                  <TableHead className="font-medium">Experience</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicePartners.length > 0 ? (
                  filteredServicePartners.map((partner: ServicePartnerType) => (
                    <TableRow
                      key={partner._id}
                      className="hover:bg-primaryBlue/5"
                    >
                      {" "}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link
                              href={`/admin/service-partners/${partner._id}`}
                            >
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(partner._id, "Pending")
                              }
                              disabled={partner.status === "Pending"}
                            >
                              Set Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(partner._id, "Active")
                              }
                              disabled={partner.status === "Active"}
                            >
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(partner._id, "Inactive")
                              }
                              disabled={partner.status === "Inactive"}
                            >
                              Set Inactive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/service-partners/${partner._id}`}
                          className="text-primaryBlue hover:text-primaryOrange font-medium"
                        >
                          {partner.name}
                        </Link>
                      </TableCell>
                      <TableCell>{partner.registrationNumber}</TableCell>
                      <TableCell>{partner.email}</TableCell>
                      <TableCell>{partner.contactPerson}</TableCell>
                      <TableCell>{partner.contactNumber}</TableCell>
                      <TableCell className="w-fit">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            partner.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : partner.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {partner.status}
                        </span>
                      </TableCell>
                      <TableCell>{partner.experience}</TableCell>
                      <TableCell>{partner.employees}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No service partners found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
