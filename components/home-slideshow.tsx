"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { apiEndpoint } from "@/helper/api";

interface Banner {
  _id: string;
  url: string;
  title: string;
  subtitle: string;
  index: number;
}

const slides = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Capture Your Special Moments",
    description: "Professional photography services for all occasions",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Look Your Best",
    description: "Expert makeup services for events and photoshoots",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=1200",
    title: "Create the Perfect Atmosphere",
    description: "Beautiful decoration services for any event",
  },
];

export default function HomeSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useDynamicBanners, setUseDynamicBanners] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiEndpoint}/banner`);
        const sortedBanners = res.data.banners.sort(
          (a: Banner, b: Banner) => a.index - b.index
        );
        setBanners(sortedBanners);

        // Only use dynamic banners if we have at least one
        if (sortedBanners.length > 0) {
          setUseDynamicBanners(true);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setUseDynamicBanners(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    if (useDynamicBanners) {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (useDynamicBanners) {
      setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [useDynamicBanners, banners.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[13em] sm:h-[20em] md:h-[25em] lg:h-[25em] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const slidesData = useDynamicBanners ? banners : slides;

  return (
    <div className="relative overflow-hidden h-[13em] sm:h-[20em] md:h-[25em] lg:h-[25em]">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {useDynamicBanners
          ? // Render dynamic banners from the database
            banners.map((banner) => (
              <div key={banner._id} className="min-w-full h-full relative">
                <Image
                  src={banner.url}
                  alt={banner.title || `Banner ${banner.index}`}
                  fill
                  className="object-cover"
                  priority
                />
                {(banner.title || banner.subtitle) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/80 to-primaryBlue/30 flex flex-col items-center justify-center text-white p-4">
                    {banner.title && (
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center text-white">
                        <span className="text-primaryOrange">
                          Contrashutter:
                        </span>{" "}
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 text-center">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          : // Render static slides as fallback
            slides.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/80 to-primaryBlue/30 flex flex-col items-center justify-center text-white p-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center text-white">
                    <span className="text-primaryOrange">Contrashutter:</span>{" "}
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 text-center">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
