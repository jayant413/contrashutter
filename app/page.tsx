// import Hero from "@/components/Hero";
import HomeSlideshow from "@/components/home-slideshow";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* <Hero /> */}
      <HomeSlideshow />
      <Services />
    </div>
  );
}
