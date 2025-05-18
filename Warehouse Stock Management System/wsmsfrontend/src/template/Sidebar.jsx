import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsHouseFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
import { FaUser, FaBox, FaBoxes, FaTruck, FaFileMedicalAlt } from "react-icons/fa";

import { useAuth } from "../context/AuthProvider";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const [open, setOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const Menus1 = [
    { title: "Dashboard", icon: <BsHouseFill />, path: "/dashboard" },
    { title: "Manage User", icon: <FaUser />, path: "/manageuser" },
    { title: "Manage Item", icon: <FaBox />, path: "/manageitem" },
    { title: "Inventory", icon: <FaBoxes />, path: "/manageinventory" },
    { title: "Distribution", icon: <FaTruck />, path: "/managedistribution" },
    { title: "Report", icon: <FaFileMedicalAlt />, path: "/generate" },
  ];

  const Menus2 = [{ title: "Logout", icon: <IoLogOut />, path: "/" }];

  return (
    <div className={`bg-[#D6D6D6] border-r flex flex-col justify-between ${open ? "w-72" : "w-14"} duration-300`}>
      <div>

        <div className="mb-5">
          <ul>
            <li className="text-black text-sm items-center cursor-pointer p-3 hover:bg-[#F3A026]" onClick={() => setOpen(!open)}>
              <span className="text-2xl">
                <GiHamburgerMenu />
              </span>
            </li>
          </ul>
        </div>

        <div>
          <ul>
            {Menus1.map((menu, index) => (
              <Link to={menu.path} key={index}>
                <li
                  className={`text-black text-sm flex items-center cursor-pointer p-3 ${location.pathname === menu.path ? "bg-[#F3A026] border-l-4 border-[#D88D1B] text-white shadow-lg" : "hover:bg-[#F3A026] hover:border-l-4 hover:border-[#D88D1B] hover:text-white transition-all duration-200"}`}>
                  <span className="text-2xl">{menu.icon}</span>
                  <span
                    className={`text-lg font-semibold transition-opacity duration-300 whitespace-nowrap ${open ? "opacity-100 ml-4" : "opacity-0 w-0 overflow-hidden"} ${location.pathname === menu.path ? "font-bold" : "font-medium"}`}>
                    {menu.title}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <ul>
          <li
            className="text-black text-sm flex items-center cursor-pointer p-3 hover:bg-[#F3A026] hover:border-l-4 hover:border-[#D88D1B] hover:text-white transition-all duration-200"
            onClick={logout}>
            <span className="text-3xl"><IoLogOut /></span>
            <span className={`text-base font-medium transition-opacity duration-300 whitespace-nowrap ${open ? "opacity-100 ml-3" : "opacity-0 w-0 overflow-hidden"}`}>
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
