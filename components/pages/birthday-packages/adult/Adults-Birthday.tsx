import MagesticBlessPackage from "./MajesticBless";
import RadiantCelebPackage from "./RadiantCeleb";
import TimeLessMomentPackage from "./TimeLessMoment";

const AdultsBirthday = () => {
  return (
    <div>
      <h1 className="flex justify-center items-center text-center mt-[2em] mb-5 ">
        ADULTS BIRTHDAY SHOOT PACKAGES{" "}
      </h1>
      <div className="grid grid-cols-3 gap-5">
        <TimeLessMomentPackage />
        <RadiantCelebPackage />
        <MagesticBlessPackage />
      </div>
    </div>
  );
};

export default AdultsBirthday;
