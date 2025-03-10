
import SilverPackage from "./SilverPackage";
import GoldenPackage from "./GoldenPackage";
import PlatinumPackage from "./PlatinumPackage";

import SignaturePrem from "./SignaturePrem";
import PlatinumLive from "./PlatinumLive";


const DecorationPackages = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <SilverPackage />
      <GoldenPackage />
      <PlatinumPackage />
      
      <SignaturePrem />
      <PlatinumLive />
    </div>
  );
};

export default DecorationPackages;
