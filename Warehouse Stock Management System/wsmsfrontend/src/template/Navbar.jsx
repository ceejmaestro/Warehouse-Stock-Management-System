import React from "react";
import { IoNotifications } from "react-icons/io5";

export default function Navbar() {
  return (
    <div className="h-5 flex justify-end items-center mr-5 ml-5 mt-5 cursor-pointer">
        <span className="text-2xl text-black p-2 bg-[#F3A026] hover:bg-[#D88D1B] border rounded-3xl">
            <IoNotifications />
        </span>
    </div>
  );
}
