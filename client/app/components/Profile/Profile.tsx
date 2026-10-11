"use client";
import React, { FC, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useLazyLogoutQuery } from "../../../redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Props {
  user: any;
}

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [logoutTrigger] = useLazyLogoutQuery();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await logoutTrigger({}).unwrap();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      toast.success("Logged out successfully");
      router.push("/");
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
            {user?.courses && user.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.courses.map((course: any, index: number) => (
                  <CourseCard
                    course={course}
                    key={course._id || index}
                    isProfile={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-Poppins text-gray-500 dark:text-gray-400">
                  You haven't enrolled in any courses yet.
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
