"use client";
import React, { FC, useState } from "react";
import {
  useGetAnalyticsOverviewQuery,
} from "../../../../redux/features/analytics/analyticsApi";
import {
  MdOutlineBarChart,
  MdOutlinePeople,
  MdOutlineMenuBook,
  MdOutlineShoppingBag,
  MdOutlineAttachMoney,
  MdOutlineTrendingUp,
} from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

interface Props {}

const AnalyticsDashboard: FC<Props> = () => {
  const { data, isLoading, refetch, isFetching } = useGetAnalyticsOverviewQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses" | "orders">(
    "overview"
  );
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    count: number;
    index: number;
  } | null>(null);

  const overview = data?.overview;
  const usersData: { month: string; count: number }[] = overview?.users?.last12Months || [];
  const coursesData: { month: string; count: number }[] = overview?.courses?.last12Months || [];
  const ordersData: { month: string; count: number }[] = overview?.orders?.last12Months || [];

  // Active chart dataset based on tab
  const activeDataset =
    activeTab === "courses"
      ? coursesData
      : activeTab === "orders"
      ? ordersData
      : usersData;

  const maxVal = Math.max(1, ...activeDataset.map((d) => d.count));

  const totalUsers = overview?.totalUsers || 0;
  const totalCourses = overview?.totalCourses || 0;
  const totalOrders = overview?.totalOrders || 0;
  const totalRevenue = overview?.totalRevenue || 0;
  const totalAdmins = overview?.totalAdmins || 0;

  return (
    <div className="p-6 800px:p-8 space-y-6 font-Poppins">
      {/* Header */}
      <div className="flex flex-col 800px:flex-row 800px:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
            <MdOutlineBarChart className="text-[#37a39a]" size={30} />
            Platform Analytics & Telemetry
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time multi-dimensional analytics: 12-month learner growth, course curriculum volume, and platform revenue.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-black dark:text-white text-xs font-medium rounded-lg transition-colors self-start 800px:self-auto disabled:opacity-50"
        >
          <FiRefreshCw className={isFetching ? "animate-spin" : ""} size={14} />
          {isFetching ? "Syncing..." : "Refresh Analytics"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 1000px:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total Learners</span>
            <span className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#37a39a] flex items-center justify-center">
              <MdOutlinePeople size={20} />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white mt-3">
            {isLoading ? "..." : totalUsers.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#37a39a] font-medium">
            <MdOutlineTrendingUp size={14} />
            <span>{totalAdmins} Admin Staff</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Published Courses</span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <MdOutlineMenuBook size={20} />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white mt-3">
            {isLoading ? "..." : totalCourses.toLocaleString()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">Active syllabus modules</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total Enrollments</span>
            <span className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <MdOutlineShoppingBag size={20} />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white mt-3">
            {isLoading ? "..." : totalOrders.toLocaleString()}
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">Completed purchases</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Gross Revenue</span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <MdOutlineAttachMoney size={20} />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white mt-3">
            {isLoading ? "..." : `$${totalRevenue.toLocaleString()}`}
          </h3>
          <p className="text-[11px] text-emerald-500 mt-2">Aggregated course sales</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "overview"
              ? "bg-[#37a39a] text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          General Growth
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "users"
              ? "bg-[#37a39a] text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          Learners Acquisition
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "courses"
              ? "bg-[#37a39a] text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          Course Releases
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "orders"
              ? "bg-[#37a39a] text-white shadow"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          }`}
        >
          Enrollments & Orders
        </button>
      </div>

      {/* 12-Month Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col 800px:flex-row 800px:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="font-bold text-base text-black dark:text-white">
              {activeTab === "courses"
                ? "12-Month Course Publication Trajectory"
                : activeTab === "orders"
                ? "12-Month Student Enrollment Velocity"
                : "12-Month Learner Registration Trajectory"}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Monthly breakdown aggregated across 28-day intervals from MongoDB Atlas.
            </p>
          </div>

          {hoveredPoint && (
            <div className="px-3 py-1.5 rounded-lg bg-[#37a39a]/10 border border-[#37a39a]/30 text-[#37a39a] text-xs font-semibold self-start 800px:self-auto">
              {hoveredPoint.month}:{" "}
              <span className="font-bold">{hoveredPoint.count}</span>{" "}
              {activeTab === "courses"
                ? "Courses"
                : activeTab === "orders"
                ? "Orders"
                : "Students"}
            </div>
          )}
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 w-full flex items-end gap-2 800px:gap-4 pt-8 pb-4 px-2 border-b border-gray-100 dark:border-gray-800">
          {activeDataset.map((item, idx) => {
            const heightPercent = maxVal > 0 ? Math.max(8, (item.count / maxVal) * 100) : 8;
            const isHovered = hoveredPoint?.index === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredPoint({ month: item.month, count: item.count, index: idx })}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Count tooltip on top of bar */}
                <span
                  className={`text-[10px] font-bold mb-1 transition-opacity ${
                    isHovered || item.count > 0
                      ? "opacity-100 text-[#37a39a]"
                      : "opacity-0 text-gray-400"
                  }`}
                >
                  {item.count}
                </span>

                {/* Animated bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[38px] rounded-t-lg transition-all duration-300 ${
                    isHovered
                      ? "bg-[#37a39a] shadow-lg shadow-[#37a39a]/30 scale-105"
                      : item.count > 0
                      ? "bg-gradient-to-t from-[#2a8078] to-[#37a39a]"
                      : "bg-gray-100 dark:bg-slate-800"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex items-center gap-2 800px:gap-4 px-2 pt-3 text-[10px] text-gray-400 font-medium overflow-x-auto">
          {activeDataset.map((item, idx) => (
            <div key={idx} className="flex-1 text-center truncate">
              {item.month.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 1000px:grid-cols-2 gap-6">
        {/* Course Level Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-black dark:text-white">
            Curriculum Complexity Distribution
          </h4>
          <p className="text-xs text-gray-400">
            Categorization of courses across beginner, intermediate, and advanced levels.
          </p>

          <div className="space-y-3 pt-2">
            {overview?.levelBreakdown &&
              Object.entries(overview.levelBreakdown).map(([lvl, count]: [string, any]) => {
                const pct = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;
                return (
                  <div key={lvl}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-black dark:text-white capitalize">{lvl}</span>
                      <span className="text-gray-500 font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-[#37a39a] to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            {(!overview?.levelBreakdown || Object.keys(overview.levelBreakdown).length === 0) && (
              <p className="text-xs text-gray-400">No course level data available yet.</p>
            )}
          </div>
        </div>

        {/* Technology / Tags Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-black dark:text-white">
            Technology Focus & Domains
          </h4>
          <p className="text-xs text-gray-400">
            Course subject domains and developer specialization tags.
          </p>

          <div className="space-y-3 pt-2">
            {overview?.categoryBreakdown &&
              Object.entries(overview.categoryBreakdown).map(([tag, count]: [string, any]) => {
                const pct = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;
                return (
                  <div key={tag}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-black dark:text-white capitalize">{tag}</span>
                      <span className="text-gray-500 font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            {(!overview?.categoryBreakdown || Object.keys(overview.categoryBreakdown).length === 0) && (
              <p className="text-xs text-gray-400">No course category data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
