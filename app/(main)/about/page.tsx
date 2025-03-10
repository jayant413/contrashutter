"use client";

import React from "react";
import Image from "next/image";
import aboutImage from "@/public/assets/Banner-1.jpg";
import missionImage from "@/public/assets/miss.jpeg";
import commitmentImage from "@/public/assets/comm.jpeg";

const About = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 flex flex-col  ">
          {/* About Us Section */}
          <div className="container mx-auto px-4 py-10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-white  rounded-lg p-6">
                <h2 className="text-primaryOrange text-2xl font-bold mb-4">
                  About Us
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
                  src={aboutImage}
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
                  src={missionImage}
                  alt="Mission Image"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <div className="bg-white  rounded-lg p-6">
                <h2 className="text-primaryOrange text-2xl font-bold mb-4">
                  Mission
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
                  Commitment
                </h2>
                <p className="text-gray-700 leading-7">
                  Contrashutter Is A Leading Service Provider Brand In The Field
                  Of Photography , Make-Up , Grooming And Decorations For Events
                  , Traditional Days. We Know The Values Of Your Priceless
                  Moments. To Make Your Event Unforgotable Our Team Of
                  Professionals Work Passionataly To Make it Unforgatable ,
                  Noticable. We Are Committed To Delivering Value.
                </p>
                <p className="text-gray-700 leading-7 mt-4">
                  ‘At Contrashutter Our Mission Is To Deliver Exceptional Value
                  Through The Creativity Of Our Professionals .We Are Committed
                  To Fastering Lasting Relationship With Our Clients. Through
                  Our Rentless Pursuit Of Excellance , We Aim To Shape a Value
                  Of Your Priceless Moment Of Happiness
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={commitmentImage}
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

export default About;
