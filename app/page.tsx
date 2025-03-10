"use client";
import { useState } from "react";
import GoldenPackageCard from "@/components/pages/photography/Card";
import Hero from "@/components/Hero";
import Makeupcard from "@/components/pages/makeup/Makeupcard";
import Services from "@/components/Services";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("hero");

  const renderContent = () => {
    if (currentPage === "/photography") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <GoldenPackageCard />
        </div>
      );
    } else if (currentPage == "makeup") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <Makeupcard />
        </div>
      );
    }
    return <Hero />;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div>{renderContent()}</div>

      <div className="hidden">
        <Button onClick={() => setCurrentPage("hero")}>Hero</Button>
        <Button onClick={() => setCurrentPage("photography")}>
          Photography
        </Button>
        <Button onClick={() => setCurrentPage("makeup")}>Makeup</Button>
      </div>

      {/* Services Section */}
      <Services />
    </div>
  );
}
