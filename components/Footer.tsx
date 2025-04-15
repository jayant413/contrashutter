"use client";

interface service {
  _id: string;
  name: string;
}

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import logo from "@/public/assets/Dark-Blue-BG-1-1024x1024.jpg";
import { Separator } from "./ui/separator";
import Link from "next/link";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";
import Store from "@/helper/store";
import { toast } from "sonner";

const Footer = () => {
  const [services, setServices] = useState<service[]>([]);
  const { user } = Store.useAuth();

  const getServices = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <footer className="bg-[#042B3A] text-gray-400  ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-3">
        <div className="flex flex-col gap-4">
          <Image
            src={logo}
            width={100}
            height={100}
            alt="Contrashutter Logo"
            className="h-20 w-20 object-contain mx-auto md:mx-0"
          />
          <p className="text-sm leading-relaxed">
            Contrashutter is a leading service provider brand in the field of
            photography, make-up, grooming, and decorations for events and
            traditional days.
          </p>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-white" />
            <span className="text-base font-bold text-white">9699008025</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-white" />
            <span className="text-base font-bold text-white">
              Contact.us@contrashutter.com
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primaryOrange mb-2  md:text-3xl">
            Our Services
          </h3>
          <Separator className="h-3 bg-[#98a0a4] mb-3" />
          <ul className="flex flex-col gap-2">
            {services.map((service: service) => (
              <div key={service._id} className="flex flex-col gap-2">
                <li>
                  <Link
                    href={`/services/${service._id}`}
                    className="hover:text-primaryOrange"
                  >
                    {service.name}
                  </Link>
                </li>
                <Separator className="bg-[#98a0a4]" />
              </div>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primaryOrange mb-2  md:text-3xl">
            Policies
          </h3>
          <Separator className="h-3 bg-[#98a0a4] mb-3" />
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/terms-conditions"
                className="hover:text-primaryOrange"
              >
                Terms And Conditions
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="/refund-policy" className="hover:text-primaryOrange">
                Refund Policy
              </Link>
            </li>
            <Separator />
            <li>
              <Link
                href="/service-cancellation-policy"
                className="hover:text-primaryOrange"
              >
                Service Cancellation Policy
              </Link>
            </li>
            <Separator />
            <li>
              <Link
                href="/return-replace-policy"
                className="hover:text-primaryOrange"
              >
                Product Return Policy
              </Link>
            </li>
            <Separator />
          </ul>
        </div>

        <div>
          <h3 className=" font-bold text-primaryOrange mb-2 text-xl md:text-3xl">
            Updates
          </h3>
          <Separator className="h-3 bg-[#98a0a4] mb-3" />
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/faqs" className="hover:text-primaryOrange">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Updates
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primaryOrange">
                Career With Us
              </Link>
            </li>
            <li>
              <Link
                href={
                  user?.role == "Service Provider"
                    ? "/partner/partner-program"
                    : "/login"
                }
                className="hover:text-primaryOrange"
                onClick={() => {
                  if (user?.role !== "Service Provider") {
                    toast.error("Please login as a service provider");
                  }
                }}
              >
                Become a Partner
              </Link>
            </li>
          </ul>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Link
              href="https://www.instagram.com/contrashutter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link
              href="https://www.facebook.com/contrashutter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link
              href="https://twitter.com/contrashutter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link
              href="https://wa.me/919699008025"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/contrashutter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
            <Link
              href="https://pinterest.com/contrashutter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primaryOrange"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                className="h-6 w-6 hover:scale-110 transition-transform"
              >
                <path
                  fill="currentColor"
                  d="M0.250245 11.999875c0 4.8113 2.89318 8.944625 7.03318 10.761875 -0.033025 -0.820475 -0.005875 -1.805425 0.204525 -2.698125 0.2259 -0.953825 1.51185 -6.402475 1.51185 -6.402475s-0.37535 -0.750225 -0.37535 -1.859c0 -1.74125 1.0092 -3.0417 2.26605 -3.0417 1.06875 0 1.5851 0.802725 1.5851 1.764 0 1.074375 -0.68525 2.6814 -1.03765 4.16985 -0.294375 1.246375 0.62495 2.263 1.854525 2.263 2.2262 0 3.725575 -2.8593 3.725575 -6.24705 0 -2.5752 -1.73445 -4.5027 -4.88915 -4.5027 -3.5642 0 -5.7846 2.658 -5.7846 5.627 0 1.023675 0.3018 1.74555 0.77455 2.304575 0.217375 0.25675 0.247575 0.360025 0.1689 0.654875 -0.05635 0.216175 -0.1858 0.73665 -0.2394 0.9429 -0.0782 0.2976 -0.31935 0.404 -0.5883 0.294125 -1.64165 -0.6702 -2.406225 -2.468 -2.406225 -4.48895 0 -3.337725 2.814975 -7.33995 8.39755 -7.33995 4.485975 0 7.43855 3.2462 7.43855 6.7308 0 4.609275 -2.562525 8.052775 -6.339875 8.052775 -1.2685 0 -2.461725 -0.685725 -2.8705 -1.4646 0 0 -0.682125 2.7072 -0.8266 3.229975 -0.249125 0.905925 -0.73675 1.811375 -1.1826 2.5171C9.7271 23.5801 10.8434 23.75 12.000375 23.75c6.4884 0 11.749325 -5.26065 11.749325 -11.750125C23.7497 5.51065 18.488775 0.25 12.000375 0.25 5.51135 0.25 0.250245 5.51065 0.250245 11.999875Z"
                  strokeWidth="0.25"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-primaryOrange w-full mt-2 items-center">
        <p className="text-sm text-center p-3 text-white">
          All Rights Are Reserved @ Contrashutter . Designed With Freepik.com
        </p>
      </div>
    </footer>
  );
};

export default Footer;
