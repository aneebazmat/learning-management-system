"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import SidebarProfile from "./SidebarProfile";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useLazyLogoutQuery } from "../../../redux/features/auth/authApi";
import { useGetAllCoursesQuery } from "../../../redux/features/courses/coursesApi";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../../redux/features/auth/authSlice";
import { apiSlice } from "../../../redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

interface Props {
  user: any;
}

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [logoutTrigger] = useLazyLogoutQuery();
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery(undefined, {});
  const dispatch = useDispatch();

  const allCourses = coursesData?.courses || [];
  const enrolledCourses = (user?.courses || [])
    .map((item: any) => {
      const targetId = item.courseId || item._id;
      return allCourses.find((c: any) => c._id === targetId);
    })
    .filter((c: any) => Boolean(c));

  const logoutHandler = async () => {
    try {
      await logoutTrigger({}).unwrap();
    } catch (_) {}

    // Clear all credentials from Redux and RTK Query cache
    dispatch(userLoggedOut());
    dispatch(apiSlice.util.resetApiState());

    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (_) {}
      toast.success("Logged out successfully");
      // Full browser reload to clean up all React state and remove profile picture immediately
      window.location.href = "/";
    }
  };

  return (
    <div className="w-[85%] flex mx-auto py-10 min-h-[75vh]">
      <div className="w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-gray-200 rounded-[8px] shadow-sm sticky top-[100px] left-[30px] p-3">
        <SidebarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>

      <div className="w-full pl-6 800px:pl-10">
        {active === 1 && (
          <div className="w-full bg-white dark:bg-slate-900/60 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <ProfileInfo avatar={avatar} user={user} />
          </div>
        )}

        {active === 2 && (
          <div className="w-full bg-white dark:bg-slate-900/60 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <ChangePassword />
          </div>
        )}

        {active === 3 && (
          <div className="w-full">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white pb-6">
              Enrolled Courses
            </h1>
            {coursesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-[#37a39a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : enrolledCourses && enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course: any) => (
                  <CourseCard
                    course={course}
                    key={course._id}
                    isProfile={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-Poppins text-gray-500 dark:text-gray-400">
                  You haven't enrolled in any courses yet.
                </h3>
                <Link
                  href="/courses"
                  prefetch={true}
                  className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[#37a39a] text-white font-Poppins text-sm font-medium hover:bg-[#2b847d] transition-colors"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
