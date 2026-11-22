"use client";
import React, { FC, useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationsApi";
import { formatTimeAgo } from "../../utils/timeAgo";
import { FiCheck, FiRefreshCw } from "react-icons/fi";

interface Props {}

const AdminHeader: FC<Props> = () => {
  const [open, setOpen] = useState(false);

  const { data, refetch, isFetching } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isLoading: isUpdating }] =
    useUpdateNotificationStatusMutation();

  const notifications = data?.notifications || [];
  const unreadNotifications = notifications.filter((n: any) => n.status === "unread");
  const unreadCount = unreadNotifications.length;

  const handleStatusChange = async (id: string) => {
    try {
      await updateNotificationStatus(id).unwrap();
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const notif of unreadNotifications) {
        await updateNotificationStatus(notif._id).unwrap();
      }
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-sm relative">
      <div className="flex items-center gap-2">
        <span className="text-xl font-Poppins font-bold text-[#37a39a]">
          Admin Portal
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {/* Notifications Icon & Dropdown Trigger */}
        <div className="relative">
          <div
            className="relative cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setOpen(!open)}
            title="Notifications"
          >
            <IoNotificationsOutline size={25} className="dark:text-white text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#37a39a] text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold shadow animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {open && (
            <div className="absolute right-0 top-12 w-[340px] 800px:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 z-50">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-Poppins font-bold text-sm text-black dark:text-white">
                    Notifications
                  </h5>
                  {unreadCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#37a39a] font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    className="p-1 rounded text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    title="Refresh notifications"
                  >
                    <FiRefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={isUpdating}
                      className="text-[11px] font-Poppins font-medium text-[#37a39a] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs font-Poppins max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">
                    <p className="font-medium text-xs">No notifications yet</p>
                    <p className="text-[11px] mt-0.5 text-gray-400">
                      New enrollments and student reviews will show up here.
                    </p>
                  </div>
                ) : (
                  notifications.map((item: any) => (
                    <div
                      key={item._id}
                      onClick={() => item.status === "unread" && handleStatusChange(item._id)}
                      className={`py-3 px-2 rounded-lg transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                        item.status === "unread"
                          ? "bg-teal-50/50 dark:bg-teal-950/20"
                          : "hover:bg-gray-50/60 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {item.status === "unread" && (
                            <span className="w-2 h-2 rounded-full bg-[#37a39a] flex-shrink-0" />
                          )}
                          <p className="font-semibold text-black dark:text-white leading-tight">
                            {item.title}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      {item.status === "unread" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(item._id);
                          }}
                          className="p-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-[#37a39a] hover:border-[#37a39a] transition-colors flex-shrink-0"
                          title="Mark as read"
                        >
                          <FiCheck size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
