import { FC } from "react";
import ServiceCancellationPolicy from "@/helper/constants/Service-Cancellation-Policy";

const ServiceCancellationPolicyPage: FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Service Cancellation Policy
        </h1>
        <p className="text-gray-600">
          Learn about our service cancellation terms and conditions
        </p>
      </div>

      <div className="space-y-6">
        {ServiceCancellationPolicy.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            For any questions about our cancellation policy, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCancellationPolicyPage;
