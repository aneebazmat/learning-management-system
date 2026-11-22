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

const demoCoursesMap: Record<string, any> = {
  "demo-1": {
    _id: "demo-1",
    name: "Full Stack Next.js 14, TypeScript & Redux Masterclass",
    description:
      "Learn how to build scalable, full-stack production-grade applications with Next.js 14, TypeScript, Tailwind, and Node.js.\n\nIn this complete series, you will build an industrial-level Learning Management System complete with user authentication, video streaming, dynamic course creation, and administrative analytics.",
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
  },
  "demo-2": {
    _id: "demo-2",
    name: "Complete Python & AI Agent Engineering Bootcamp",
    description:
      "Master modern AI workflows, LLM tools, LangChain, autonomous agents, and Python backend engineering.\n\nLearn how to construct resilient multi-agent swarms, integrate vector embeddings, and automate complex developer tasks.",
    price: 39,
    estimatedPrice: 79,
    ratings: 5.0,
    purchased: 890,
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    benefits: [
      { title: "Build autonomous AI agents with tools and memory" },
      { title: "Deploy FastAPI microservices with Docker" },
      { title: "Implement high-throughput caching and stream responses" },
    ],
    prerequisites: [
      { title: "Basic knowledge of Python syntax" },
      { title: "Curiosity for artificial intelligence and agents" },
    ],
    courseData: [
      { title: "Introduction to Agentic Architectures", videoLength: 20 },
      { title: "FastAPI Endpoints & Streaming LLM Responses", videoLength: 45 },
      { title: "Tool Calling, Sandboxing & Safety Rails", videoLength: 55 },
      { title: "Production Deployment on Cloud Compute", videoLength: 35 },
    ],
  },
  "demo-3": {
    _id: "demo-3",
    name: "Advanced DevOps & Cloud Infrastructure with Docker & Kubernetes",
    description:
      "Deploy and orchestrate high-availability cloud applications using modern CI/CD pipelines, Docker containers, and Kubernetes clusters.\n\nMaster production deployment strategies, automated canary testing, and zero-downtime upgrades.",
    price: 59,
    estimatedPrice: 120,
    ratings: 4.8,
    purchased: 650,
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    benefits: [
      { title: "Containerize modern microservices with Docker multi-stage builds" },
      { title: "Orchestrate high-availability workloads with Kubernetes and Helm" },
      { title: "Configure production CI/CD pipelines with GitHub Actions" },
    ],
    prerequisites: [
      { title: "Basic Linux terminal commands and networking fundamentals" },
      { title: "A computer capable of running Docker Desktop" },
    ],
    courseData: [
      { title: "Docker Containerization Fundamentals", videoLength: 25 },
      { title: "Multi-Stage Dockerfiles for Next.js & Node.js", videoLength: 40 },
      { title: "Kubernetes Deployments, Services & Ingress", videoLength: 60 },
      { title: "Automated CI/CD with Zero Downtime", videoLength: 45 },
    ],
  },
  "demo-4": {
    _id: "demo-4",
    name: "Industrial React Native & Mobile App Development",
    description:
      "Create cross-platform iOS and Android applications with native device animations, offline caching, and push notifications.",
    price: 45,
    estimatedPrice: 85,
    ratings: 4.7,
    purchased: 430,
    demoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    benefits: [
      { title: "Develop native mobile apps for both iOS and Android" },
      { title: "Implement offline-first data caching and sync" },
      { title: "Publish apps to Google Play Store and Apple App Store" },
    ],
    prerequisites: [
      { title: "Basic knowledge of React and JavaScript" },
    ],
    courseData: [
      { title: "React Native Setup & Native Navigation", videoLength: 30 },
      { title: "State Management & Offline Storage", videoLength: 50 },
      { title: "Native Device APIs & Push Notifications", videoLength: 45 },
      { title: "App Store Publishing & Best Practices", videoLength: 35 },
    ],
  },
};

const CoursePage: FC<Props> = ({ params }) => {
  const { id } = params;
  const { data } = useGetCourseDetailsQuery(id);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [route, setRoute] = useState("Login");

  const courseData = data?.course || demoCoursesMap[id] || demoCoursesMap["demo-1"];

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
