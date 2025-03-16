import { FC } from "react";
import FAQS from "@/helper/constants/FAQs";

const FAQsPage: FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600">
          Find answers to common questions about our services
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <details
            key={index}
            className="group bg-white rounded-lg border border-gray-200 p-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer">
              <h2 className="font-medium text-gray-900">{faq.question}</h2>
              <svg
                className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQsPage;
