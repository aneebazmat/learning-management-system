"use client";
import React, { FC } from "react";
import { RiUserLine, RiBookOpenLine, RiMoneyDollarCircleLine, RiEyeLine } from "react-icons/ri";

const DashboardHero: FC = () => {
  const stats = [
    {
      title: "Total Registered Users",
      value: "1,248",
      change: "+12% this month",
      icon: <RiUserLine size={28} className="text-[#2190ff]" />,
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Active Courses",
      value: "14",
      change: "+2 new this week",
      icon: <RiBookOpenLine size={28} className="text-[#37a39a]" />,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Gross Enrollment Revenue",
      value: "$42,850",
      change: "+18% vs last month",
      icon: <RiMoneyDollarCircleLine size={28} className="text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Course Video Views",
      value: "89,400",
      change: "+5,200 this week",
      icon: <RiEyeLine size={28} className="text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white">
        Dashboard Overview
      </h2>
      <p className="text-sm font-Poppins text-gray-500 dark:text-gray-400 mt-1">
        Monitor real-time platform performance, course enrollments, and revenue metrics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-Poppins text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <h3 className="text-2xl font-Poppins font-bold text-black dark:text-white mt-1">
                {stat.value}
              </h3>
              <span className="text-[11px] font-Poppins text-emerald-500 font-medium">
                {stat.change}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-lg font-Poppins font-bold text-black dark:text-white mb-4">
          Recent Student Enrollments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-Poppins">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 text-xs uppercase">
                <th className="py-3">Student</th>
                <th className="py-3">Course</th>
                <th className="py-3">Price</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:border-gray-800">
              <tr>
                <td className="py-3 font-medium text-black dark:text-white">Hamza Tariq</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">Next.js 14 Masterclass</td>
                <td className="py-3 font-semibold text-black dark:text-white">$49.00</td>
                <td className="py-3 text-gray-500 text-xs">Today, 09:24 AM</td>
                <td className="py-3"><span className="px-2 py-1 rounded-full text-[11px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold">Completed</span></td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-black dark:text-white">Ayesha Malik</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">Python AI Agent Bootcamp</td>
                <td className="py-3 font-semibold text-black dark:text-white">$39.00</td>
                <td className="py-3 text-gray-500 text-xs">Yesterday, 04:15 PM</td>
                <td className="py-3"><span className="px-2 py-1 rounded-full text-[11px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold">Completed</span></td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-black dark:text-white">Bilal Ahmed</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">Cloud Infrastructure & Docker</td>
                <td className="py-3 font-semibold text-black dark:text-white">$59.00</td>
                <td className="py-3 text-gray-500 text-xs">2 days ago</td>
                <td className="py-3"><span className="px-2 py-1 rounded-full text-[11px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
