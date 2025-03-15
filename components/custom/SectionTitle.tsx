"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Import Button component
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string; // Define title prop
  hideBackButton?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  hideBackButton = false,
  className = "",
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center relative",
        className
      )}
    >
      {!hideBackButton && (
        <Button
          variant="ghost"
          type="button"
          className="absolute left-0 top-[-2em] lg:top-0"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Go Back
        </Button>
      )}
      <h1 className="text-3xl font-bold text-center mb-6 text-primaryBlue border-b w-fit place-self-center pb-[0.3em]">
        {title} {/* Use title prop instead of activeEvent and activePackage */}
      </h1>
    </div>
  );
};

export default SectionTitle;
