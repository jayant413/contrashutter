import React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import logo from "@/public/assets/Dark-Blue-BG-1-1024x1024.jpg";
import { Separator } from "./ui/separator";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#042B3A] text-gray-400  ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-3">
        <div className="flex flex-col gap-4">
          <Image
            src={logo}
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
            <li>
              <Link href="photography" className="hover:text-primaryOrange">
                Photography
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="make-up" className="hover:text-primaryOrange">
                Beauty & Make-Up
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="decoration" className="hover:text-primaryOrange">
                Decorations
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                More......
              </Link>
            </li>
            <Separator />
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primaryOrange mb-2  md:text-3xl">
            Policies
          </h3>
          <Separator className="h-3 bg-[#98a0a4] mb-3" />
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Terms And Conditions
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Refund Policy
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Service Cancellation Policy
              </Link>
            </li>
            <Separator />
            <li>
              <Link href="#" className="hover:text-primaryOrange">
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
              <Link href="#" className="hover:text-primaryOrange">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Updates
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Career With Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primaryOrange">
                Become a Partner
              </Link>
            </li>
          </ul>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Link href="#" className="hover:text-primaryOrange">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primaryOrange">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primaryOrange">
              <Youtube className="h-6 w-6" />
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
