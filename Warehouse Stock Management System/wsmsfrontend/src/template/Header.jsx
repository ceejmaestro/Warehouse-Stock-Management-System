import React from "react";
import { Link } from "react-router-dom"; 
import companyLogo from "../assets/icons/companylogo.png"; 
import userIcon from "../assets/icons/icon.png"; 
import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="relative h-20 w-full overflow-hidden">

      {/* header design */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-[#F3A026] border-b border-black"></div>
      <div className="absolute top-0 left-0 w-[75%] h-full bg-gradient-to-r from-[#D6D6D6] to-[#FFFFFF] rounded-br-[90px] border-b border-r border-black"></div>

      <div className="relative flex items-center justify-between h-full px-4 md:px-6 lg:px-8">

        {/* company logo */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <div className="h-16 w-16 md:h-17 md:w-17 flex items-center justify-center bg-white rounded-full border-2 border-black overflow-hidden cursor-pointer">
              <img src={companyLogo} alt="Company Logo" className="h-full w-full object-cover" />
            </div>
          </Link>

          {/* company name */}
          <h1 className="text-sm md:text-lg lg:text-xl font-bold">
            <span className="text-black mr-1">WAREHOUSE</span>
            <span className="text-[#F3A026]">STOCK MANAGEMENT SYSTEM</span>
          </h1>
        </div>

        {/* user profile */}
        <div className="flex items-center gap-3">
          <h3 className="text-white text-xs md:text-sm lg:text-base font-semibold hidden sm:block">
            Hello
            <span className="ml-1 uppercase">{user}</span>
          </h3>
            <img src={userIcon} alt="Profile" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
        </div>

      </div>

    </div>
  );
}
