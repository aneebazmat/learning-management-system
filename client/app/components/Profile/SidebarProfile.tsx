"use client";
import React, { FC } from "react";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";

interface Props {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
}

const SidebarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-lg transition-colors ${
          active === 1
            ? "bg-slate-100 dark:bg-slate-800"
            : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
        onClick={() => setActive(1)}
      >
        <div className="relative w-[30px] h-[30px] 800px:w-[36px] 800px:h-[36px] rounded-full overflow-hidden border-2 border-[#37a39a]">
          <Image
            src={
              avatar ||
              user?.avatar?.url ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            }
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        </div>
        <h5 className="pl-3 800px:block hidden font-Poppins dark:text-white text-black font-medium">
          My Account
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-lg transition-colors ${
          active === 2
            ? "bg-slate-100 dark:bg-slate-800"
            : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={24} className="dark:text-white text-black" />
        <h5 className="pl-3 800px:block hidden font-Poppins dark:text-white text-black font-medium">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-lg transition-colors ${
          active === 3
            ? "bg-slate-100 dark:bg-slate-800"
            : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={24} className="dark:text-white text-black" />
        <h5 className="pl-3 800px:block hidden font-Poppins dark:text-white text-black font-medium">
          Enrolled Courses
        </h5>
      </div>

      {user?.role === "admin" && (
        <Link
          href={"/admin"}
          className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-lg transition-colors ${
            active === 6
              ? "bg-slate-100 dark:bg-slate-800"
              : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          <MdOutlineAdminPanelSettings
            size={24}
            className="text-[#37a39a]"
          />
          <h5 className="pl-3 800px:block hidden font-Poppins text-[#37a39a] font-medium">
            Admin Dashboard
          </h5>
        </Link>
      )}

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-lg transition-colors ${
          active === 4
            ? "bg-slate-100 dark:bg-slate-800"
            : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
        }`}
        onClick={logoutHandler}
      >
        <AiOutlineLogout size={24} className="text-red-500" />
        <h5 className="pl-3 800px:block hidden font-Poppins text-red-500 font-medium">
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default SidebarProfile;
