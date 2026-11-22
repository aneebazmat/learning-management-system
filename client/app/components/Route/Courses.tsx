"use client";
import React, { FC } from "react";
import CourseCard, { CourseCardSkeleton } from "../Course/CourseCard";
import { useGetAllCoursesQuery } from "../../../redux/features/courses/coursesApi";

const Courses: FC = () => {
  const { data, isLoading } = useGetAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const coursesList = data?.courses || [];

  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-12">
      <div className="text-center">
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
          Expand Your Career{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#2190ff] to-[#37a39a]">
            Opportunity
          </span>{" "}
          <br />
          With Our Industrial Courses
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto font-Poppins">
          Learn real-world software engineering directly from experienced industry practitioners.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 1500px:grid-cols-3 1500px:gap-[35px] mt-10">
          {[1, 2, 3].map((item) => (
            <CourseCardSkeleton key={item} />
          ))}
        </div>
      ) : coursesList.length > 0 ? (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 1500px:grid-cols-3 1500px:gap-[35px] mt-10">
          {coursesList.map((course: any) => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-gray-800 mt-10">
          <p className="text-gray-500 dark:text-gray-400 font-Poppins text-sm">
            No courses available at the moment. Please check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;
