"use client";
import React, { FC } from "react";
import CoursePlayer from "../../Course/CoursePlayer";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";

interface Props {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isLoading: boolean;
}

const CoursePreview: FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isLoading,
}) => {
  const discountPercent =
    courseData?.estimatedPrice && courseData?.price
      ? Math.round(
          ((courseData.estimatedPrice - courseData.price) /
            courseData.estimatedPrice) *
            100
        )
      : 0;

  return (
    <div className="w-[90%] m-auto py-6">
      <div className="w-full relative">
        <div className="w-full mt-6">
          <CoursePlayer
            videoUrl={
              courseData?.demoUrl ||
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
            title={courseData?.name}
          />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <h1 className="text-3xl font-Poppins font-bold text-black dark:text-white">
            {courseData?.price === 0 ? "Free" : `$${courseData?.price || 49}`}
          </h1>
          {courseData?.estimatedPrice && (
            <h5 className="text-gray-400 line-through text-lg font-Poppins">
              ${courseData?.estimatedPrice}
            </h5>
          )}
          {discountPercent > 0 && (
            <span className="text-xs px-2.5 py-1 rounded bg-[#37a39a]/20 text-[#37a39a] font-Poppins font-semibold">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <h1 className="text-2xl font-Poppins font-bold text-black dark:text-white mt-4">
          {courseData?.name || "Course Title"}
        </h1>

        <div className="mt-6">
          <h3 className="text-lg font-Poppins font-semibold text-black dark:text-white">
            What you will learn:
          </h3>
          <div className="mt-3 space-y-2">
            {courseData?.benefits?.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <IoCheckmarkDoneOutline
                  size={18}
                  className="text-[#37a39a] mt-1 shrink-0"
                />
                <span className="text-sm font-Poppins text-gray-700 dark:text-gray-300">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-Poppins font-semibold text-black dark:text-white">
            Prerequisites:
          </h3>
          <div className="mt-3 space-y-2">
            {courseData?.prerequisites?.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <BsArrowRight
                  size={16}
                  className="text-[#37a39a] mt-1 shrink-0"
                />
                <span className="text-sm font-Poppins text-gray-700 dark:text-gray-300">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-Poppins font-semibold text-black dark:text-white">
            Course Description:
          </h3>
          <p className="mt-2 text-sm font-Poppins text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {courseData?.description}
          </p>
        </div>

        <div className="w-full flex items-center justify-between pt-10">
          <button
            onClick={() => setActive(active - 1)}
            className="w-[180px] h-[40px] bg-gray-500 text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleCourseCreate}
            disabled={isLoading}
            className={`w-[200px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-[#2b847d] transition-colors shadow-lg ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Publishing..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
