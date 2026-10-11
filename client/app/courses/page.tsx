"use client";
import React, { FC, useState, useEffect, Suspense } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard from "../components/Course/CourseCard";
import { useGetAllCoursesQuery } from "../../redux/features/courses/coursesApi";
import { useSearchParams } from "next/navigation";

// Fallback courses for complete visual demonstration
const defaultCourses = [
  {
    _id: "demo-1",
    name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
    description: "Learn how to build scalable, full-stack production-grade applications with Next.js 14, TypeScript, Tailwind, and Node.js.",
    price: 49,
    estimatedPrice: 99,
    category: "Web Development",
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
    category: "Artificial Intelligence",
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
    category: "Cloud & DevOps",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    },
    ratings: 4.8,
    purchased: 650,
    courseData: new Array(15),
  },
  {
    _id: "demo-4",
    name: "Industrial React Native & Mobile App Development",
    description: "Create cross-platform iOS and Android applications with native device animations and offline caching.",
    price: 45,
    estimatedPrice: 85,
    category: "Mobile",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    },
    ratings: 4.7,
    purchased: 430,
    courseData: new Array(12),
  },
];

const categories = ["All", "Web Development", "Artificial Intelligence", "Cloud & DevOps", "Mobile"];

const CoursesList: FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title") || "";
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const { data } = useGetAllCoursesQuery({});

  useEffect(() => {
    let source = data?.courses && data.courses.length > 0 ? data.courses : defaultCourses;

    if (category !== "All") {
      source = source.filter((item: any) => item.category === category || item.tags?.includes(category));
    }
    if (search !== "") {
      source = source.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setCourses(source);
  }, [data, category, search]);

  return (
    <div className="w-[90%] 800px:w-[85%] m-auto py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl 800px:text-4xl font-Poppins font-bold text-black dark:text-white">
          Explore Our All Courses
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-Poppins">
          Filter through top categories to find the right skill to master today.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        {categories.map((item, index) => (
          <button
            key={index}
            onClick={() => setCategory(item)}
            className={`px-5 py-2 rounded-full text-sm font-Poppins transition-all ${
              category === item
                ? "bg-[#37a39a] text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 1500px:grid-cols-4 1500px:gap-[30px] mt-12">
        {courses.length > 0 ? (
          courses.map((course: any, index: number) => (
            <CourseCard course={course} key={course._id || index} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-lg font-Poppins text-gray-500">
              No courses found matching your criteria.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

const CoursesPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Suspense
          fallback={
            <div className="w-full py-20 text-center font-Poppins text-gray-400">
              Loading courses catalog...
            </div>
          }
        >
          <CoursesList />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default CoursesPage;
