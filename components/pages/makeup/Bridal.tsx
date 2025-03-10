import Image from "next/image";
import bridal from "../../../public/makeup/bridal.jpeg";
import Link from "next/link";
const Bridal = () => {
  return (
    <div className="max-w-[800px] w-[20em] border border-black mx-auto bg-white-50 rounded-lg shadow-lg overflow-hidden my-3 p-3">
      <h1 className="bg-blue-200 text-black text-md font-bold sm:text-base flex items-center justify-center text-center p-2">
        Bridal Pack
      </h1>
      <div className="items-center">
        <h2 className="text-black-700 text-sm font-semibold sm:text-base mb-2 flex items-center justify-center text-center p-2">
          Bridal Pack
        </h2>
        <div className="h-44 bg-white flex items-center justify-center  rounded-sm shadow-inner text-xs">
          <Image className="h-44 w-auto" src={bridal} alt={""} />
        </div>
        {/* <Separator className="bg-[#ddbe61] h-1 my-2" />
                <div className="text-left p-2">
                    <h3 className="text-xs font-semibold text-[#664e12] text-center sm:text-sm">
                        Exclusive Features
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-[#664e12] text-xs">
                        <li>Full-Day Coverage</li>
                        <li>High-Resolution Photos</li>
                        <li>10 Premium Edited Portraits</li>
                        <li>Customized Theme Setup</li>
                        <li>Luxury Album (50 Photos)</li>
                    </ul>
                </div> */}
        {/* <Separator className="bg-blue-500 h-1 my-2" /> */}
        <div className="flex-col space-y-2 mt-[2em] ">
          <button className="w-full border border-black text-2xl bg-white text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
            <Link href="make-up/package">View Packages</Link>
          </button>
          {/* <div className="flex-col space-y-2">
                    <button className="w-1/2 bg-white text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                            Get Quotation
                        </button>
                        <button className="w-1/2 bg-white text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                            Share
                        </button>
                        <button className="w-1/2 bg-white text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                            Add to Wishlist
                        </button>
                        <button className="w-1/2 bg-white text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                            Book Now
                        </button>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default Bridal;
