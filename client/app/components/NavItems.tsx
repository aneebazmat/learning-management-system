"use client";
import React from "react";
import Link from "next/link";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

interface NavItemsProps {
  activeItem: number;
  isMobile: boolean;
  setOpenSidebar?: (open: boolean) => void;
}

const NavItems: React.FC<NavItemsProps> = ({ activeItem, isMobile, setOpenSidebar }) => {
  return (
    <>
      <div className="hidden 800px:flex items-center">
        {navItemsData &&
          navItemsData.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              prefetch={true}
              className={`${
                activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson] font-medium"
                  : "dark:text-white text-black"
              } text-[18px] px-6 font-Poppins font-[400] transition-colors duration-200 hover:text-[#37a39a]`}
            >
              {item.name}
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setOpenSidebar && setOpenSidebar(false)}
              className="text-[25px] font-Poppins font-[600] text-black dark:text-white"
            >
              <span className="text-[#37a39a] text-3xl font-bold">E</span>
              <span>Learning</span>
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((item, index) => (
              <Link
                href={item.url}
                key={index}
                prefetch={true}
                onClick={() => setOpenSidebar && setOpenSidebar(false)}
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson] font-medium"
                    : "dark:text-white text-black"
                } block py-5 text-[18px] px-6 font-Poppins font-[400] transition-colors hover:text-[#37a39a]`}
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
