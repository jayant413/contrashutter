import { FC } from "react";
import RefundPolicy from "@/helper/constants/Refund-Policy";

interface SubSection {
  title: string;
  content: string[];
}

type ContentItem = string | SubSection;

interface PolicySection {
  title: string;
  content: ContentItem[] | SubSection[];
}

const RefundPolicyPage: FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
        <p className="text-gray-600">
          Learn about our refund terms and conditions
        </p>
      </div>

      <div className="space-y-8">
        {RefundPolicy.map((section: PolicySection, index) => (
          <section
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {section.title}
            </h2>

            {Array.isArray(section.content) &&
            section.content.length > 0 &&
            typeof section.content[0] === "string" ? (
              <ul className="space-y-3">
                {(section.content as string[]).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-6">
                {(section.content as SubSection[]).map(
                  (subsection, subIndex) => (
                    <div key={subIndex} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {subsection.title}
                      </h3>
                      <ul className="space-y-3">
                        {subsection.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start space-x-3"
                          >
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                            <span className="text-gray-700 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            For any questions about our refund policy, please contact our
            support team at{" "}
            <a
              href="mailto:Account@contrashutter.com"
              className="text-blue-600 hover:underline"
            >
              Account@contrashutter.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
