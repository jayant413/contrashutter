"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { apiEndpoint, imageEndpoint } from "@/helper/api";

const Hero = () => {
  const [banners, setBanners] = useState<{ url: string; index: number }[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiEndpoint}/banner`);
        const sortedBanners = res.data.banners.sort(
          (a: { index: number }, b: { index: number }) => a.index - b.index
        );
        setBanners(sortedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Automatically switch slides every 3 seconds
  useEffect(() => {
    if (banners.length === 0) return; // Don't start interval if no banners

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[50vh] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[50vh] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-fit overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="w-full h-[13em] sm:h-[20em] md:h-[25em] lg:h-[27.5em] xl:h-[30em] 2xl:h-[38em] flex-shrink-0 relative"
          >
            {/* <Link href={banner.url} className="absolute top-0 left-0">
              {imageEndpoint}/{banner.url}
            </Link> */}
            <Image
              src={`${imageEndpoint}/${banner.url}`}
              alt={`Banner ${banner.index}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
