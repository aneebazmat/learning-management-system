"use client";
import React, { FC, useState, useMemo, Suspense } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard, { CourseCardSkeleton } from "../components/Course/CourseCard";
import { useGetAllCoursesQuery } from "../../redux/features/courses/coursesApi";
import { useSearchParams } from "next/navigation";

const categories = ["All", "Web Development", "Artificial Intelligence", "Cloud & DevOps", "Mobile"];

const CoursesList: FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title") || "";
  const [category, setCategory] = useState("All");
  const { data, isLoading } = useGetAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const courses = useMemo(() => {
    let source = data?.courses || [];

    if (category !== "All") {
      source = source.filter(
        (item: any) => item.category === category || item.tags?.includes(category)
      );
    }
    if (search !== "") {
      source = source.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return source;
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
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <CourseCardSkeleton key={i} />)
        ) : courses.length > 0 ? (
          courses.map((course: any) => (
            <CourseCard course={course} key={course._id} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
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
            <div className="w-[90%] 800px:w-[85%] m-auto py-10">
              <div className="text-center max-w-2xl mx-auto">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse" />
                <div className="h-4 w-96 bg-gray-100 dark:bg-gray-800/60 rounded mt-3 mx-auto animate-pulse" />
              </div>
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 1500px:grid-cols-4 1500px:gap-[30px] mt-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
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
