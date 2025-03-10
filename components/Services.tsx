"use client";

import React from "react";
import Image from "next/image";
import photo1 from "@/public/assets/photogra1.jpeg";
import deco1 from "@/public/assets/deco1.jpeg";
import makeup1 from "@/public/assets/makeup1.jpeg";
import SectionTitle from "./custom/SectionTitle";

const Services = () => {
  return (
    <div className="flex flex-col ">
      {/* Page Heading */}

      <SectionTitle title="Our Services" hideBackButton className="mt-[2em]" />

      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          {/* About Us Section */}
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-white  rounded-lg p-6">
                <h2 className="text-primaryOrange text-2xl font-bold mb-4">
                  Photography
                </h2>
                <p className="text-gray-700 leading-7">
                  Contrashutter is a leading service provider brand in the field
                  of photography, makeup, grooming, and decorations for events
                  and traditional days. We know the values of your priceless
                  moments. To make your event unforgettable, our team of
                  professionals works passionately to make it unforgettable and
                  noticeable. We are committed to delivering values.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={photo1}
                  alt="About Us Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="flex items-center justify-center order-last md:order-first">
                <Image
                  src={makeup1}
                  alt="Mission Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <div className="bg-white  rounded-lg p-6">
                <h2 className="text-primaryOrange text-2xl font-bold mb-4">
                  Makeup and Beauty
                </h2>
                <p className="text-gray-700 leading-7">
                  At Contrashutter, our mission is to deliver exceptional value
                  through the creativity of our professionals. We are committed
                  to fostering lasting relationships with our clients.
                </p>
                <p className="text-gray-700 leading-7 mt-4">
                  Through our relentless pursuit of excellence, we aim to shape
                  a value of your priceless moments of happiness.
                </p>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-white  rounded-lg p-6">
                <h2 className="text-primaryOrange text-2xl font-bold mb-4">
                  Decoration
                </h2>
                <p className="text-gray-700 leading-7">
                  Contrashutter Is A Leading Service Provider Brand In The Field
                  Of Photography, Make-Up, Grooming And Decorations For Events,
                  Traditional Days. We Know The Values Of Your Priceless
                  Moments. To Make Your Event Unforgettable, Our Team Of
                  Professionals Work Passionately To Make It Unforgettable And
                  Noticeable. We Are Committed To Delivering Value.
                </p>
                <p className="text-gray-700 leading-7 mt-4">
                  ‘At Contrashutter Our Mission Is To Deliver Exceptional Value
                  Through The Creativity Of Our Professionals. We Are Committed
                  To Fostering Lasting Relationships With Our Clients. Through
                  Our Relentless Pursuit Of Excellence, We Aim To Shape The
                  Value Of Your Priceless Moments Of Happiness.’
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={deco1}
                  alt="Commitment Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
