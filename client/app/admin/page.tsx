"use client";
import React, { FC, useState } from "react";
import AdminProtected from "../hooks/adminProtected";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminHeader from "../components/Admin/AdminHeader";
import DashboardHero from "../components/Admin/DashboardHero";
import CreateCourse from "../components/Admin/Course/CreateCourse";
import AllCourses from "../components/Admin/Course/AllCourses";
import AllUsers from "../components/Admin/Users/AllUsers";
import AnalyticsDashboard from "../components/Admin/Analytics/AnalyticsDashboard";

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
            {active === 4 && <AllUsers />}
            {active === 5 && <AnalyticsDashboard />}
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default AdminPage;
