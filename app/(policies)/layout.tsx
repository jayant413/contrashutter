import { FC, ReactNode } from "react";
import PolicyNavigation from "./components/PolicyNavigation";

interface PoliciesLayoutProps {
  children: ReactNode;
}

const PoliciesLayout: FC<PoliciesLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PolicyNavigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PoliciesLayout;
