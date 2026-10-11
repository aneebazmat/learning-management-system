"use client";
import React, { FC, useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import { IoNotificationsOutline } from "react-icons/io5";

interface Props {}

const AdminHeader: FC<Props> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-Poppins font-bold text-[#37a39a]">
          Admin Portal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div
          className="relative cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <IoNotificationsOutline size={25} className="dark:text-white text-black" />
          <span className="absolute -top-1 -right-1 bg-[#37a39a] text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
            3
          </span>
        </div>

        {open && (
          <div className="absolute right-6 top-16 w-[320px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 z-50">
            <h5 className="font-Poppins font-semibold text-sm text-black dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
              Notifications
            </h5>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs font-Poppins">
              <div className="py-2.5">
                <p className="font-medium text-black dark:text-white">New Enrollment</p>
                <p className="text-gray-500">Student enrolled in Full Stack Next.js</p>
              </div>
              <div className="py-2.5">
                <p className="font-medium text-black dark:text-white">New Review Added</p>
                <p className="text-gray-500">5-star rating received on Python Bootcamp</p>
              </div>
              <div className="py-2.5">
                <p className="font-medium text-black dark:text-white">System Status</p>
                <p className="text-gray-500">Database & Redis caching operating normally</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
