import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-primaryBlue">Contact</span>{" "}
          <span className="text-primaryOrange">Us</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We&apos;d love to hear from you. Reach out to us for any inquiries or
          to book our services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-primaryOrange">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Our office"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primaryBlue/80 to-primaryBlue/30 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Visit Our Studio</h3>
                <p className="max-w-md mx-auto">
                  Come experience our creative space and meet our team of
                  professionals
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-6 rounded-xl shadow-md border border-primaryBlue/20">
            <h3 className="text-xl font-bold mb-4 text-primaryBlue dark:text-blue-300">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primaryOrange mt-1" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Photography Lane
                    <br />
                    Creative District
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primaryOrange mt-1" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primaryOrange mt-1" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    info@contrashutter.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primaryBlue/5 dark:bg-primaryBlue/20 p-6 rounded-xl shadow-md border border-primaryBlue/20">
            <h3 className="text-xl font-bold mb-4 text-primaryBlue dark:text-blue-300">
              Business Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {/* <div className="mt-12 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Map location"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-bold text-primaryBlue">
                Contrashutter Studio
              </h3>
              <p className="text-sm">123 Photography Lane, New York</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
