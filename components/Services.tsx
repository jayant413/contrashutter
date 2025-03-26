"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export const services = [
  {
    id: "photography",
    title: "Photography",
    description:
      "Professional photography services for weddings, events, portraits, and more.",
    image: "/placeholder.svg?height=300&width=400",
    features: [
      "Wedding Photography",
      "Portrait Sessions",
      "Event Coverage",
      "Product Photography",
    ],
  },
  {
    id: "makeup",
    title: "Make Up",
    description:
      "Expert makeup services for special occasions, photoshoots, and everyday glamour.",
    image: "/placeholder.svg?height=300&width=400",
    features: [
      "Bridal Makeup",
      "Special Occasion",
      "Photoshoot Styling",
      "Makeup Lessons",
    ],
  },
  {
    id: "decoration",
    title: "Decoration",
    description:
      "Beautiful decoration services for weddings, parties, corporate events, and more.",
    image: "/placeholder.svg?height=300&width=400",
    features: [
      "Wedding Decor",
      "Party Setups",
      "Corporate Events",
      "Themed Decorations",
    ],
  },
];

const Services = () => {
  return (
    <section className=" py-8 px-[1em] lg:px-0">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="text-primaryBlue">Our</span>{" "}
          <span className="text-primaryOrange">Services</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We offer a comprehensive range of professional services to make your
          events memorable.
        </p>
      </div>

      {/* Services in alternating layout */}
      {services.map((service, index) => (
        <div
          key={service.id}
          className={`flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } gap-8 items-center mb-10 md:h-[350px]`}
        >
          <div className="w-full md:w-1/2 relative h-[350px] md:h-full  rounded-xl overflow-hidden">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover "
            />
            <div className=" absolute inset-0 bg-gradient-to-t from-primaryBlue/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-3xl font-bold text-white mb-2">
                {service.title}
              </h3>
              <Link href={`/services/${service.id}`}>
                <Button className="mt-4 bg-primaryOrange hover:bg-primaryOrange/90 text-white">
                  Explore {service.title}
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-fit md:h-full block ">
            <div className="bg-primaryBlue/5 h-full dark:bg-primaryBlue/20 p-8 rounded-xl shadow-md border border-primaryBlue/20">
              <h3 className="text-2xl font-bold mb-4 text-primaryOrange">
                {service.title} Services
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {service.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primaryOrange"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Call to action */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to create memorable moments?
        </h3>
        <Link href="/contact">
          <Button className="bg-primaryBlue hover:bg-primaryBlue/90 text-white">
            Contact Us Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Services;
