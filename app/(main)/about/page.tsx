import Image from "next/image";
import { Camera, Award, Users, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className=" mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-primaryBlue">About</span>{" "}
          <span className="text-primaryOrange">Us</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We are a team of passionate professionals dedicated to capturing and
          creating beautiful moments for all your special events.
        </p>
      </div>

      {/* Hero section with large image */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-16">
        <Image
          src="/placeholder.svg?height=1200&width=2000"
          alt="Contrashutter team"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primaryBlue/80 to-transparent flex items-center">
          <div className="max-w-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2013, Contrashutter began with a simple mission: to
              capture life&apos;s most precious moments with artistry and
              authenticity.
            </p>
            <p>
              What started as a small photography studio has grown into a
              full-service event company, offering photography, makeup, and
              decoration services for all types of events.
            </p>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-primaryBlue text-white p-6 rounded-xl text-center">
          <Camera className="h-10 w-10 mx-auto mb-4 text-primaryOrange" />
          <div className="text-4xl font-bold mb-2">5000+</div>
          <div className="text-white/80">Events Covered</div>
        </div>
        <div className="bg-primaryBlue text-white p-6 rounded-xl text-center">
          <Users className="h-10 w-10 mx-auto mb-4 text-primaryOrange" />
          <div className="text-4xl font-bold mb-2">1000+</div>
          <div className="text-white/80">Happy Clients</div>
        </div>
        <div className="bg-primaryBlue text-white p-6 rounded-xl text-center">
          <Award className="h-10 w-10 mx-auto mb-4 text-primaryOrange" />
          <div className="text-4xl font-bold mb-2">15+</div>
          <div className="text-white/80">Industry Awards</div>
        </div>
        <div className="bg-primaryBlue text-white p-6 rounded-xl text-center">
          <Clock className="h-10 w-10 mx-auto mb-4 text-primaryOrange" />
          <div className="text-4xl font-bold mb-2">10+</div>
          <div className="text-white/80">Years Experience</div>
        </div>
      </div>

      {/* Content sections */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primaryOrange">01</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-primaryOrange">
            Why Choose Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            At Contrashutter, we bring your special moments to life with our
            exceptional photography and event services. Our team of
            professionals is dedicated to capturing the essence of your events
            with creativity and precision.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            We pride ourselves on attention to detail, personalized service, and
            delivering beyond expectations. Every client receives our undivided
            attention and a customized approach to their unique needs.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primaryOrange">02</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-primaryOrange">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our mission is to transform ordinary events into extraordinary
            memories. We strive to capture authentic moments that tell your
            unique story. Through our lens, we aim to preserve the emotions,
            connections, and joy that make each event special.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            We are committed to providing exceptional service that exceeds
            client expectations. We believe that every moment deserves to be
            captured with care, creativity, and technical excellence.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <div className="w-12 h-12 bg-primaryOrange/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-primaryOrange">03</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-primaryOrange">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We envision becoming the premier choice for event photography and
            services, known for our artistic excellence and customer
            satisfaction. We aim to continuously innovate our craft, embrace new
            technologies, and set new standards in the industry.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Our goal is to build lasting relationships with our clients through
            trust and quality. We see a future where Contrashutter is synonymous
            with exceptional event services and unforgettable memories.
          </p>
        </div>
      </div>

      {/* Team section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <span className="text-primaryBlue">Meet Our</span>{" "}
          <span className="text-primaryOrange">Team</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((member) => (
            <div
              key={member}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
            >
              <div className="relative h-64">
                <Image
                  src={`/placeholder.svg?height=400&width=300&text=Team Member ${member}`}
                  alt={`Team member ${member}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">Team Member {member}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member === 1
                    ? "Lead Photographer"
                    : member === 2
                    ? "Makeup Artist"
                    : member === 3
                    ? "Decoration Specialist"
                    : "Client Coordinator"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
