import Bridal from "./Bridal";
import Custom from "./Custom";
import Luxury from "./Luxury";
import Mehendi from "./Mehendi";
import Nailart from "./Nailart";
import PreBridal from "./PreBridal";

const Makeupcard = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <Bridal />
      <Custom />
      <Luxury />
      <Mehendi />
      <Nailart />
      <PreBridal />
    </div>
  );
};

export default Makeupcard;
