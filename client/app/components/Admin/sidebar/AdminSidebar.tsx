"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiHome4Line,
  RiUserLine,
  RiVideoAddLine,
  RiPlayListLine,
  RiBarChartLine,
  RiSettings4Line,
  RiArrowLeftLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getSafeAvatar } from "../../../utils/avatar";

interface Props {
  active: number;
  setActive: (active: number) => void;
}

const AdminSidebar: FC<Props> = ({ active, setActive }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-[260px] min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between">
      <div>
        {/* Admin profile header */}
        <div className="text-center py-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative w-[70px] h-[70px] mx-auto rounded-full overflow-hidden border-2 border-[#37a39a]">
            <Image
              src={getSafeAvatar(user?.avatar?.url)}
              alt="Admin"
              fill
              sizes="70px"
              className="object-cover"
            />
          </div>
          <h4 className="mt-3 font-Poppins font-bold text-black dark:text-white text-base">
            {user?.name || "Administrator"}
          </h4>
          <span className="text-xs font-Poppins text-[#37a39a] font-medium uppercase tracking-wider">
            Role: {user?.role || "Admin"}
          </span>
        </div>

        {/* Navigation list */}
        <div className="mt-6 space-y-1 font-Poppins text-sm">
          <div
            onClick={() => setActive(1)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              active === 1
                ? "bg-[#37a39a] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <RiHome4Line size={20} />
            <span>Dashboard</span>
          </div>

          <div
            onClick={() => setActive(2)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              active === 2
                ? "bg-[#37a39a] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <RiVideoAddLine size={20} />
            <span>Create Course</span>
          </div>

          <div
            onClick={() => setActive(3)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              active === 3
                ? "bg-[#37a39a] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <RiPlayListLine size={20} />
            <span>Live Courses</span>
          </div>

          <div
            onClick={() => setActive(4)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              active === 4
                ? "bg-[#37a39a] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <RiUserLine size={20} />
            <span>Manage Users</span>
          </div>

          <div
            onClick={() => setActive(5)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              active === 5
                ? "bg-[#37a39a] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <RiBarChartLine size={20} />
            <span>Analytics</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm font-Poppins"
        >
          <RiArrowLeftLine size={20} />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
