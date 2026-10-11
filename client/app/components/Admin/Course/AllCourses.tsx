"use client";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";

interface Props {}

const AllCourses: FC<Props> = () => {
  const { data, isLoading } = useGetAllCoursesQuery({});

  const courses = data?.courses || [
    {
      _id: "demo-1",
      name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
      price: 49,
      ratings: 4.9,
      purchased: 1240,
      createdAt: "2026-10-01",
      thumbnail: {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
      },
    },
    {
      _id: "demo-2",
      name: "Complete Python & AI Agent Engineering Bootcamp",
      price: 39,
      ratings: 5.0,
      purchased: 890,
      createdAt: "2026-10-05",
      thumbnail: {
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
      },
    },
    {
      _id: "demo-3",
      name: "Advanced DevOps & Cloud Infrastructure with Docker",
      price: 59,
      ratings: 4.8,
      purchased: 650,
      createdAt: "2026-10-08",
      thumbnail: {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white">
            All Live Courses
          </h2>
          <p className="text-sm font-Poppins text-gray-500">
            Manage course listings, inspect ratings, and review student engagement.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm font-Poppins">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 text-xs uppercase bg-gray-50 dark:bg-slate-800/40">
              <th className="p-4">Course</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Students</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {courses.map((course: any) => (
              <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative w-12 h-9 rounded overflow-hidden shrink-0">
                    <Image
                      src={
                        course.thumbnail?.url ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={course.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-black dark:text-white max-w-xs truncate">
                    {course.name}
                  </span>
                </td>
                <td className="p-4 font-semibold text-black dark:text-white">
                  ${course.price}
                </td>
                <td className="p-4 text-[#f6b100] font-medium">
                  ★ {course.ratings || 5.0}
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">
                  {course.purchased || 0}
                </td>
                <td className="p-4 flex items-center gap-2">
                  <Link
                    href={`/course/${course._id}`}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-[#37a39a]"
                    title="View Public Page"
                  >
                    <AiOutlineEye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCourses;
