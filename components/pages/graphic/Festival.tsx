
import { Separator } from "../../ui/separator";
import Image from "next/image";
import fest from "../../../public/photography/festival.jpeg"
import Link from "next/link";
const Festival = () => {
    return (
        <div className="max-w-[260px] mx-auto bg-yellow-50 rounded-lg shadow-md overflow-hidden my-3 p-3">
            <h1 className="bg-[#ddbe61] text-white text-sm font-bold sm:text-base flex items-center justify-center text-center p-2">
                Festivals
            </h1>
            <div className="items-center">
                <h2 className="text-yellow-700 text-sm font-semibold sm:text-base mb-2 flex items-center justify-center text-center p-2">
                    Golden Photography Package
                </h2>
                <div className="h-24 bg-gray-200 flex items-center justify-center text-gray-600 rounded-sm shadow-inner text-xs">
                    <Image className="h-24" src = {fest} alt={''}/>
                </div>
                <Separator className="bg-[#ddbe61] h-1 my-2" />
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
                </div>
                <Separator className="bg-[#ddbe61] h-1 my-2" />
                <div className="space-y-2">
                    <button className="w-full bg-[#ddbe61] text-white py-1 rounded-md shadow hover:bg-yellow-500 hover:shadow-md transition-all duration-300 text-xs">
                    <Link href="package"> Enquire Now</Link>
                    </button>
                    <div className="flex space-x-2">
                        <button className="w-1/2 bg-[#ddbe61] text-white py-1 rounded-md shadow hover:bg-yellow-500 hover:shadow-md transition-all duration-300 text-xs">
                            Get Quotation
                        </button>
                        <button className="w-1/2 bg-[#ddbe61] text-white py-1 rounded-md shadow hover:bg-yellow-500 hover:shadow-md transition-all duration-300 text-xs">
                            Book Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Festival;