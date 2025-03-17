import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Services />
    </div>
  );
}
