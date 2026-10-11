"use client";
import React, { FC } from "react";
import CourseCard from "../Course/CourseCard";
import { useGetAllCoursesQuery } from "../../../redux/features/courses/coursesApi";

// Curated default courses for instant rich visual experience if DB empty
const fallbackCourses = [
  {
    _id: "demo-1",
    name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
    description: "Learn how to build scalable, full-stack production-grade applications with Next.js 14, TypeScript, Tailwind, and Node.js.",
    price: 49,
    estimatedPrice: 99,
    thumbnail: {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    },
    ratings: 4.9,
    purchased: 1240,
    courseData: new Array(18),
  },
  {
    _id: "demo-2",
    name: "Complete Python & AI Agent Engineering Bootcamp",
    description: "Master modern AI workflows, LLM tools, LangChain, autonomous agents, and Python backend engineering.",
    price: 39,
    estimatedPrice: 79,
    thumbnail: {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    },
    ratings: 5.0,
    purchased: 890,
    courseData: new Array(24),
  },
  {
    _id: "demo-3",
    name: "Advanced DevOps & Cloud Infrastructure with Docker & Kubernetes",
    description: "Deploy and orchestrate high-availability cloud applications using modern CI/CD pipelines, Docker, and Kubernetes.",
    price: 59,
    estimatedPrice: 120,
    thumbnail: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    },
    ratings: 4.8,
    purchased: 650,
    courseData: new Array(15),
  },
];

const Courses: FC = () => {
  const { data, isLoading } = useGetAllCoursesQuery({});
  const coursesList = data?.courses && data.courses.length > 0 ? data.courses : fallbackCourses;

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

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 1500px:grid-cols-3 1500px:gap-[35px] mt-10">
        {coursesList.map((course: any, index: number) => (
          <CourseCard course={course} key={course._id || index} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
