import GoldenYearPackage from "./GoldenYear";
import EternalGracePackage from "./EternalGrace";
import EverLastingPackage from "./EverLasting";

const OlderBirthday = () => {
  return (
    <div>
      <h1 className="flex justify-center items-center text-center mb-5">
        OLDER PERSONS BIRTHDAY SHOOT PACKAGES
      </h1>
      <div className="grid grid-cols-3 gap-5">
        <GoldenYearPackage />
        <EverLastingPackage />
        <EternalGracePackage />
      </div>
    </div>
  );
};

export default OlderBirthday;
