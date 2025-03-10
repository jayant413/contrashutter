import Wedding from "@/components/pages/photography/Wedding";
import Birthday from "./Birthday";
import Corporate from "./Corporate";
import Pre_wedding from "./Pre-wedding";
import Product from "./Product";
import Festival from "./Festival";
const GoldenPackageCard = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <Wedding />
      <Birthday />
      <Corporate />
      <Pre_wedding />
      <Product />
      <Festival />
    </div>
  );
};

export default GoldenPackageCard;
