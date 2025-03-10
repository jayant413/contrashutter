import LittleStarPackage from "./LittleStarPackage";
import SparklingPackage from "./Sparkling";
import UltimateWonderPackage from "./UltimateWonderPackage";

const KidsBirthday = () => {
  return (
    <div>
      <h1 className="flex justify-center items-center text-center mt-[2em] mb-5">
        <button className="bg-blue">KIDS BIRTHDAY SHOOT PACKAGES</button>{" "}
      </h1>
      <div className="grid grid-cols-3 gap-5">
        <LittleStarPackage />
        <SparklingPackage />
        <UltimateWonderPackage />
      </div>
    </div>
  );
};

export default KidsBirthday;
