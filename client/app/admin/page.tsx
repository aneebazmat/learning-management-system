"use client";
import React, { FC, useState } from "react";
import AdminProtected from "../hooks/adminProtected";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminHeader from "../components/Admin/AdminHeader";
import DashboardHero from "../components/Admin/DashboardHero";
import CreateCourse from "../components/Admin/Course/CreateCourse";
import AllCourses from "../components/Admin/Course/AllCourses";

interface Props {}

const AdminPage: FC<Props> = () => {
  const [active, setActive] = useState(1);

  return (
    <AdminProtected>
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <AdminSidebar active={active} setActive={setActive} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <div className="flex-1">
            {active === 1 && <DashboardHero />}
            {active === 2 && <CreateCourse setActiveNav={setActive} />}
            {active === 3 && <AllCourses />}
            {active === 4 && (
              <div className="p-8">
                <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white">
                  User Management
                </h2>
                <p className="text-sm font-Poppins text-gray-500 mt-2">
                  Inspect active learners, assign instructor permissions, and manage user roles.
                </p>
                <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-Poppins text-gray-600 dark:text-gray-300">
                    Active users are synced directly with MongoDB Atlas and Upstash Redis.
                  </p>
                </div>
              </div>
            )}
            {active === 5 && (
              <div className="p-8">
                <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white">
                  Platform Analytics
                </h2>
                <p className="text-sm font-Poppins text-gray-500 mt-2">
                  Comprehensive 12-month course sales, enrollment growth, and student retention trajectories.
                </p>
                <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-Poppins text-gray-600 dark:text-gray-300">
                    Analytics dashboards aggregate telemetry across courses, orders, and active sessions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default AdminPage;
