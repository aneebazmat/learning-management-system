"use client";
import React, { FC, useState } from "react";
import CoursePlayer from "./CoursePlayer";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-hot-toast";

interface Props {
  data: any;
  setRoute?: any;
  setOpen?: any;
}

const CourseDetails: FC<Props> = ({ data, setRoute, setOpen }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [openCollapse, setOpenCollapse] = useState<{ [key: number]: boolean }>({});

  const discountPercent =
    data?.estimatedPrice && data?.price
      ? Math.round(((data.estimatedPrice - data.price) / data.estimatedPrice) * 100)
      : 0;

  const isPurchased = user?.courses?.some(
    (item: any) => item.courseId === data?._id || item._id === data?._id
  );

  const handleOrder = () => {
    if (!user) {
      if (setOpen && setRoute) {
        setRoute("Login");
        setOpen(true);
      } else {
        toast.error("Please login to enroll in this course");
      }
      return;
    }
    // Direct enrollment navigation
    router.push(`/course-access/${data?._id || "demo-1"}`);
  };

  const toggleCollapse = (index: number) => {
    setOpenCollapse((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-10">
      <div className="w-full flex flex-col-reverse 800px:flex-row gap-10">
        {/* Left main content column */}
        <div className="w-full 800px:w-[65%]">
          <h1 className="text-2xl 800px:text-3xl font-Poppins font-bold text-black dark:text-white">
            {data?.name}
          </h1>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) =>
                i <= Math.round(data?.ratings || 5) ? (
                  <AiFillStar key={i} size={20} className="text-[#f6b100]" />
                ) : (
                  <AiOutlineStar key={i} size={20} className="text-[#f6b100]" />
                )
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-Poppins">
                ({data?.reviews?.length || 15} Reviews)
              </span>
            </div>
            <h5 className="text-sm text-gray-500 dark:text-gray-400 font-Poppins">
              {data?.purchased || 0} Students Enrolled
            </h5>
          </div>

          <br />
          <br />
          {/* Benefits section */}
          <h2 className="text-xl font-Poppins font-semibold text-black dark:text-white">
            What you will learn from this course?
          </h2>
          <div className="mt-4 space-y-3">
            {(data?.benefits || [
              { title: "Master industrial architecture from scratch to deployment" },
              { title: "Implement production-grade authentication and session management" },
              { title: "Build responsive, high-performance user interfaces with dark mode" },
            ]).map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <IoCheckmarkDoneOutline
                  size={20}
                  className="text-[#37a39a] mt-1 shrink-0"
                />
                <p className="text-sm sm:text-base font-Poppins text-gray-700 dark:text-gray-300">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          <br />
          <br />
          {/* Prerequisites section */}
          <h2 className="text-xl font-Poppins font-semibold text-black dark:text-white">
            What are the prerequisites for this course?
          </h2>
          <div className="mt-4 space-y-3">
            {(data?.prerequisites || [
              { title: "Basic understanding of JavaScript and web fundamentals" },
              { title: "A computer with Node.js and an active internet connection" },
            ]).map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <BsArrowRight
                  size={16}
                  className="text-[#37a39a] mt-1.5 shrink-0"
                />
                <p className="text-sm sm:text-base font-Poppins text-gray-700 dark:text-gray-300">
                  {item.title}
                </p>
              </div>
            ))}
          </div>

          <br />
          <br />
          {/* Course Overview / Curriculum */}
          <h2 className="text-xl font-Poppins font-semibold text-black dark:text-white">
            Course Overview
          </h2>
          <div className="mt-4 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 flex justify-between items-center">
              <span className="font-Poppins font-medium text-sm text-black dark:text-white">
                {data?.courseData?.length || 12} Lectures • 18 Hours Total Length
              </span>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {(data?.courseData || [
                { title: "Introduction & Development Environment Setup", videoLength: 15 },
                { title: "Core Architecture & State Management", videoLength: 45 },
                { title: "Backend API Integration & Security", videoLength: 60 },
                { title: "Deployment & Production Optimization", videoLength: 30 },
              ]).map((lecture: any, index: number) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <span className="text-sm font-Poppins text-gray-800 dark:text-gray-200">
                    {index + 1}. {lecture.title}
                  </span>
                  <span className="text-xs text-gray-500 font-Poppins">
                    {lecture.videoLength || 25} mins
                  </span>
                </div>
              ))}
            </div>
          </div>

          <br />
          <br />
          {/* Course Description */}
          <h2 className="text-xl font-Poppins font-semibold text-black dark:text-white">
            Course Details
          </h2>
          <p className="mt-3 text-sm sm:text-base font-Poppins text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {data?.description ||
              "This course is designed to take you step-by-step through real-world software engineering practices. You will gain deep knowledge of component architecture, state management, secure backend endpoints, and cloud deployments."}
          </p>
        </div>

        {/* Right sticky action card */}
        <div className="w-full 800px:w-[35%] relative">
          <div className="sticky top-[100px] w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-xl">
            <CoursePlayer
              videoUrl={
                data?.demoUrl ||
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              }
              title={data?.name}
            />

            <div className="flex items-baseline gap-3 mt-5">
              <h1 className="text-3xl font-Poppins font-bold text-black dark:text-white">
                {data?.price === 0 ? "Free" : `$${data?.price || 49}`}
              </h1>
              {data?.estimatedPrice && (
                <h5 className="text-gray-400 line-through text-lg font-Poppins">
                  ${data?.estimatedPrice}
                </h5>
              )}
              {discountPercent > 0 && (
                <span className="text-xs px-2 py-1 rounded bg-[#37a39a]/20 text-[#37a39a] font-Poppins font-semibold">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="mt-5">
              {isPurchased ? (
                <Link
                  href={`/course-access/${data?._id}`}
                  className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-[#37a39a] text-white font-Poppins font-semibold hover:bg-[#2b847d] transition-colors"
                >
                  Enter Course
                </Link>
              ) : (
                <button
                  onClick={handleOrder}
                  className="w-full py-3 px-6 rounded-full bg-[#2190ff] text-white font-Poppins font-semibold hover:bg-[#1a76d2] transition-colors shadow-lg"
                >
                  Enroll Now
                </button>
              )}
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
              <h4 className="font-Poppins text-sm font-semibold text-black dark:text-white">
                This course includes:
              </h4>
              <ul className="text-xs font-Poppins text-gray-600 dark:text-gray-400 space-y-1.5 list-disc pl-4">
                <li>Full lifetime access</li>
                <li>Full source code repository</li>
                <li>Certificate of completion</li>
                <li>Direct instructor Q&A access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
