"use client";
import React, { FC, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CourseDetails from "../../components/Course/CourseDetails";
import { useGetCourseDetailsQuery } from "../../../redux/features/courses/coursesApi";

interface Props {
  params: {
    id: string;
  };
}

const CoursePage: FC<Props> = ({ params }) => {
  const { id } = params;
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState("Login");

  // Fallback demo course in case DB course with this ID is fresh or mock
  const courseData = data?.course || {
    _id: id,
    name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
    description: "Learn how to build scalable, full-stack production-grade applications with Next.js 14, TypeScript, Tailwind, and Node.js.\n\nIn this complete series, you will build an industrial-level Learning Management System complete with user authentication, video streaming, dynamic course creation, and administrative analytics.",
    price: 49,
    estimatedPrice: 99,
    ratings: 4.9,
    purchased: 1240,
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    benefits: [
      { title: "Master industrial architecture from scratch to deployment" },
      { title: "Implement production-grade authentication and session management" },
      { title: "Build responsive, high-performance user interfaces with dark mode" },
      { title: "Manage state cleanly using Redux Toolkit Query" },
    ],
    prerequisites: [
      { title: "Basic understanding of JavaScript and web fundamentals" },
      { title: "A computer with Node.js and an active internet connection" },
    ],
    courseData: [
      { title: "Course Introduction & Setup", videoLength: 15 },
      { title: "Frontend Architecture & Layouts", videoLength: 45 },
      { title: "Redux Toolkit State Management", videoLength: 50 },
      { title: "Backend Controller & Database Schemas", videoLength: 60 },
      { title: "Production Deployment Strategies", videoLength: 30 },
    ],
  };

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
        <CourseDetails
          data={courseData}
          setRoute={setRoute}
          setOpen={setOpen}
        />
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;
