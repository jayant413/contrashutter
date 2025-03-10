import Image from "next/image";
import prebridal from "../../../public/makeup/prebridal.jpeg";
import Link from "next/link";
const PreBridal = () => {
  return (
    <div className="max-w-[800px] w-[20em] border border-black mx-auto bg-white-50 rounded-lg shadow-lg overflow-hidden my-3 p-3">
      <h1 className="bg-blue-200 text-black text-md font-bold sm:text-base flex items-center justify-center text-center p-2">
        Pre Bridal
      </h1>
      <div className="items-center">
        <h2 className="text-black-700 text-sm font-semibold sm:text-base mb-2 flex items-center justify-center text-center p-2">
          Prebridal and Beauty
        </h2>
        <div className="h-44 bg-white flex items-center justify-center rounded-sm shadow-inner text-xs">
          <Image className="h-44 w-auto" src={prebridal} alt={""} />
        </div>

        <div className="flex-col space-y-2 mt-[2em]">
          <button className="w-full bg-white border border-black text-2xl text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
            <Link href="make-up/package">View Packages</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreBridal;
