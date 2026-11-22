"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlinePlayLesson } from "react-icons/md";

interface Props {
  course: any;
  isProfile?: boolean;
}

const CourseCard: FC<Props> = ({ course, isProfile }) => {
  const ratings = course?.ratings || 5;

  return (
    <Link
      href={
        !isProfile
          ? `/course/${course._id || course.id}`
          : `/course-access/${course._id || course.id}`
      }
      prefetch={true}
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[bg-slate-700] rounded-lg p-3 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <div className="relative w-full h-[180px] rounded overflow-hidden">
          <Image
            src={
              course?.thumbnail?.url ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
            }
            alt={course?.name || "Course thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff] font-semibold line-clamp-2">
          {course?.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          {/* Star ratings */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= Math.round(ratings) ? (
                <AiFillStar key={i} size={18} className="text-[#f6b100]" />
              ) : (
                <AiOutlineStar key={i} size={18} className="text-[#f6b100]" />
              )
            )}
            <span className="text-black dark:text-gray-300 text-xs ml-1 font-Poppins">
              ({ratings.toFixed(1)})
            </span>
          </div>
          <h5 className="text-black dark:text-[#fff] text-xs font-Poppins flex items-center gap-1">
            <HiOutlineUserGroup size={16} />
            <span>{course?.purchased || 0} Students</span>
          </h5>
        </div>

        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-black dark:text-[#fff] font-semibold font-Poppins text-[16px]">
              {course?.price === 0 ? "Free" : `$${course?.price}`}
            </h3>
            {course?.estimatedPrice && course?.estimatedPrice > course?.price && (
              <h5 className="text-gray-400 line-through text-[13px] font-Poppins">
                ${course?.estimatedPrice}
              </h5>
            )}
          </div>
          <div className="flex items-center gap-1 text-black dark:text-gray-300 text-xs font-Poppins">
            <MdOutlinePlayLesson size={16} className="text-[#37a39a]" />
            <span>
              {course?.courseData?.length ?? 0}{" "}
              {course?.courseData?.length === 1 ? "Lecture" : "Lectures"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const CourseCardSkeleton: FC = () => (
  <div className="w-full min-h-[35vh] dark:bg-slate-800/40 bg-gray-100 border dark:border-[#ffffff10] border-gray-200 rounded-lg p-3 animate-pulse">
    <div className="w-full h-[180px] bg-gray-200 dark:bg-slate-700/60 rounded-md" />
    <div className="mt-4 h-4 bg-gray-200 dark:bg-slate-700/60 rounded w-3/4" />
    <div className="mt-2 h-4 bg-gray-200 dark:bg-slate-700/60 rounded w-1/2" />
    <div className="mt-4 flex justify-between items-center">
      <div className="h-3 bg-gray-200 dark:bg-slate-700/60 rounded w-1/4" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700/60 rounded w-1/4" />
    </div>
    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <div className="h-5 bg-gray-200 dark:bg-slate-700/60 rounded w-16" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700/60 rounded w-20" />
    </div>
  </div>
);

export default CourseCard;
