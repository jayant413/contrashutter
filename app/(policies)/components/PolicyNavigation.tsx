"use client";
import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PolicyNavigation: FC = () => {
  const pathname = usePathname();

  const policies = [
    { name: "FAQs", path: "/faqs" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Return & Replace Policy", path: "/return-replace-policy" },
    {
      name: "Service Cancellation Policy",
      path: "/service-cancellation-policy",
    },
    { name: "Refund Policy", path: "/refund-policy" },
  ];

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 h-16">
          {policies.map((policy) => (
            <Link
              key={policy.path}
              href={`${policy.path}`}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === `${policy.path}`
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {policy.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PolicyNavigation;
