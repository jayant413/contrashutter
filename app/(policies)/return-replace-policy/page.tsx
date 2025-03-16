import { FC } from "react";
import ReturnReplacePolicy from "@/helper/constants/Return-Replace-Policy";

const ReturnReplacePolicyPage: FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Return & Replace Policy
        </h1>
        <p className="text-gray-600">
          Understanding our return and replacement policies
        </p>
      </div>

      <div className="space-y-8">
        {ReturnReplacePolicy.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              {section.content.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-gray-700 leading-relaxed pl-4"
                >
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            For any questions about our return and replace policy, please
            contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnReplacePolicyPage;
