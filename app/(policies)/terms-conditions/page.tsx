import { FC } from "react";
import TermsConditions from "@/helper/constants/Terms-Conditions";

const TermsConditionsPage: FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-600">
          Please read our terms and conditions carefully
        </p>
      </div>

      <div className="space-y-8">
        {TermsConditions.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <ul className="space-y-3 list-disc list-inside">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsConditionsPage;
