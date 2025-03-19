import Image from "next/image";
import birth from "../../../public/photography/birthday.jpeg";
import Link from "next/link";
const Birthday = () => {
  return (
    <div className="max-w-[800px] w-[20em] border border-black mx-auto bg-white-50 rounded-lg shadow-lg overflow-hidden my-3 p-3">
      <h1 className="bg-blue-200 text-black text-md font-bold sm:text-base flex items-center justify-center text-center p-2">
        Birthday
      </h1>
      <div className="items-center">
        <h2 className="text-black-700 text-sm font-semibold sm:text-base mb-2 flex items-center justify-center text-center p-2">
          Birthday Pack
        </h2>
        <div className="h-44 bg-white flex items-center justify-center  rounded-sm shadow-inner text-xs">
          <Image
            className="h-44 w-auto"
            width={100}
            height={100}
            src={birth}
            alt={""}
          />
        </div>

        <div className="flex-col space-y-2 mt-[2em]">
          <button className="w-full text-2xl  border-black bg-white text-black py-1 rounded-md border shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 ">
            <Link href="/photography/birthday">View Packages</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Birthday;
