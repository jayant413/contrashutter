import { Separator } from "../../../ui/separator";
import Link from "next/link";


const MagesticBlessPackage = () =>{
    return (
        <div className="max-w-[800px] w-[20em] border border-gray-300 mx-auto bg-white rounded-lg shadow-md overflow-hidden my-3 p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="bg-blue-500 text-white text-sm font-bold py-1 px-2 rounded-full">MBP</div>
                <div className="text-green-600 font-semibold">Available</div>
            </div>
            <h1 className="text-gray-800 text-md font-bold mb-1">Magestic Bless Package</h1>
            <p className="text-gray-500 text-sm">Price: ₹9,000</p>
            <p className="text-gray-500 text-sm mb-4">Wed, July 12, 2023 - 6:12 PM</p>
            <Separator className="bg-gray-200 h-[1px] mb-4" />

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-700">Scrambled eggs with toast</span>
                    <span className="text-gray-700">$16.99</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Smoked Salmon Bagel</span>
                    <span className="text-gray-700">$18.49</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Belgian Waffles</span>
                    <span className="text-gray-700">$12.99</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Classic Lemonade</span>
                    <span className="text-gray-700">$12.49</span>
                </div>
            </div>
            <Separator className="bg-gray-200 h-[1px] my-4" />
            <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold text-lg">Total</span>
                <span className="text-gray-900 font-bold text-lg">$87.34</span>
            </div>
            

            

            <div className="flex-col space-y-2 mt-4">
                <button className="w-1/2 bg-white border border-black text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                    Get Quotation
                </button>
                <button className="w-1/2 bg-white border border-black text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                    Share
                </button>
                <button className="w-1/2 bg-white border border-black text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                    Add to Wishlist
                </button>
                <button className="w-1/2 bg-white border border-black text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                    Book Now
                </button>
                <button className="w-1/2 ml-16 bg-white border border-black text-black py-1 rounded-md shadow hover:bg-blue-500 hover:shadow-md transition-all duration-300 text-xm">
                    <Link href="/photography/birthday/adult/magestic">Details</Link>
                </button>
            </div>
        </div>
    );
}

export default MagesticBlessPackage;