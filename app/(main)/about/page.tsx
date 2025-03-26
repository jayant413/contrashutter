import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
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

      {/* Why Choose Us Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-20">
        <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Professional photographer at work"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Professional Excellence
            </h3>
            <p className="text-white/90">
              Our team brings years of experience and artistic vision to every
              project
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-8 rounded-xl shadow-md border border-primaryBlue/20">
            <h2 className="text-3xl font-bold mb-6 text-primaryOrange">
              Why Choose Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At Contrashutter, we bring your special moments to life with our
              exceptional photography and event services. Our team of
              professionals is dedicated to capturing the essence of your events
              with creativity and precision.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We pride ourselves on attention to detail, personalized service,
              and delivering beyond expectations. Every client receives our
              undivided attention and a customized approach to their unique
              needs.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Award-winning photographers and designers</li>
              <li>State-of-the-art equipment and techniques</li>
              <li>Personalized service for every client</li>
              <li>Quick turnaround without compromising quality</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="flex flex-col md:flex-row-reverse gap-8 items-center mb-20">
        <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Team collaborating on a project"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Capturing Moments
            </h3>
            <p className="text-white/90">
              Every smile, tear, and laugh preserved forever
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-8 rounded-xl shadow-md border border-primaryBlue/20">
            <h2 className="text-3xl font-bold mb-6 text-primaryOrange">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our mission is to transform ordinary events into extraordinary
              memories. We strive to capture authentic moments that tell your
              unique story. Through our lens, we aim to preserve the emotions,
              connections, and joy that make each event special.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We are committed to providing exceptional service that exceeds
              client expectations. We believe that every moment deserves to be
              captured with care, creativity, and technical excellence.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-full bg-primaryOrange flex items-center justify-center text-white text-2xl font-bold">
                10+
              </div>
              <div>
                <h4 className="font-bold text-primaryBlue dark:text-blue-300">
                  Years of Experience
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Creating beautiful memories since 2013
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Creative vision concept"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Looking Forward
            </h3>
            <p className="text-white/90">
              Embracing innovation and setting new standards
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-8 rounded-xl shadow-md border border-primaryBlue/20">
            <h2 className="text-3xl font-bold mb-6 text-primaryOrange">
              Our Vision
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We envision becoming the premier choice for event photography and
              services, known for our artistic excellence and customer
              satisfaction. We aim to continuously innovate our craft, embrace
              new technologies, and set new standards in the industry.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our goal is to build lasting relationships with our clients
              through trust and quality. We see a future where Contrashutter is
              synonymous with exceptional event services and unforgettable
              memories.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <h4 className="font-bold text-primaryOrange">1000+</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Clients
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <h4 className="font-bold text-primaryOrange">5000+</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Events Covered
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
