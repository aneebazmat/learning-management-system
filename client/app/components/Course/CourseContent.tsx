"use client";
import React, { FC, useState } from "react";
import CoursePlayer from "./CoursePlayer";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
import { MdOutlinePlayCircle, MdOutlineCheckCircle } from "react-icons/md";
import { toast } from "react-hot-toast";

interface Props {
  id: string;
  user: any;
}

const mockLectures = [
  {
    _id: "lec-1",
    videoSection: "Module 1: Foundations & Architecture",
    title: "1. Welcome & Project Overview",
    description: "In this introductory lecture, we explore the project goals, architecture decisions, and design systems.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoLength: 12,
    links: [{ title: "Source Code Repository", url: "https://github.com" }],
  },
  {
    _id: "lec-2",
    videoSection: "Module 1: Foundations & Architecture",
    title: "2. Next.js 14 App Router Deep Dive",
    description: "Learn how the App Router organizes pages, layouts, error boundaries, and nested routes.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoLength: 25,
    links: [{ title: "Next.js Documentation", url: "https://nextjs.org" }],
  },
  {
    _id: "lec-3",
    videoSection: "Module 2: State Management & Redux",
    title: "3. Redux Toolkit Query Setup & Cache Invalidation",
    description: "Understand the store lifecycle, API slices, base queries, and mutation optimistic updates.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoLength: 35,
    links: [{ title: "RTK Query Guides", url: "https://redux-toolkit.js.org" }],
  },
  {
    _id: "lec-4",
    videoSection: "Module 3: Production Backend",
    title: "4. Express, MongoDB Atlas & Redis Session Cache",
    description: "Connect MongoDB Atlas, write robust Mongoose schemas, and leverage Upstash Redis for high-speed caching.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    videoLength: 40,
    links: [{ title: "Mongoose Reference", url: "https://mongoosejs.com" }],
  },
];

const CourseContent: FC<Props> = ({ id, user }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0 = Overview, 1 = Resources, 2 = Q&A, 3 = Reviews
  const [question, setQuestion] = useState("");
  const [questionsList, setQuestionsList] = useState<any[]>([
    {
      user: { name: "Sarah Connor" },
      question: "How do we handle JWT token expiration on the client gracefully?",
      createdAt: "2 days ago",
    },
  ]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const currentLecture = mockLectures[activeVideo];

  const handleAddQuestion = (e: any) => {
    e.preventDefault();
    if (question.trim() === "") return;
    setQuestionsList([
      {
        user: { name: user?.name || "Student" },
        question,
        createdAt: "Just now",
      },
      ...questionsList,
    ]);
    setQuestion("");
    toast.success("Question submitted to instructor!");
  };

  const handleAddReview = (e: any) => {
    e.preventDefault();
    if (review.trim() === "") return;
    toast.success("Review submitted! Thank you for your feedback.");
    setReview("");
  };

  return (
    <div className="w-[92%] m-auto py-8">
      <div className="w-full flex flex-col 1000px:flex-row gap-8">
        {/* Main video player and discussion tabs */}
        <div className="w-full 1000px:w-[70%]">
          <CoursePlayer
            videoUrl={currentLecture.videoUrl}
            title={currentLecture.title}
          />

          {/* Navigation between lectures */}
          <div className="w-full flex items-center justify-between my-4">
            <button
              onClick={() => setActiveVideo(activeVideo - 1)}
              disabled={activeVideo === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-Poppins text-sm ${
                activeVideo === 0
                  ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500"
                  : "bg-[#2190ff] text-white hover:bg-[#1a76d2]"
              }`}
            >
              <AiOutlineArrowLeft size={16} /> Prev Lesson
            </button>

            <button
              onClick={() => setActiveVideo(activeVideo + 1)}
              disabled={activeVideo === mockLectures.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-Poppins text-sm ${
                activeVideo === mockLectures.length - 1
                  ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500"
                  : "bg-[#2190ff] text-white hover:bg-[#1a76d2]"
              }`}
            >
              Next Lesson <AiOutlineArrowRight size={16} />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-Poppins font-bold text-black dark:text-white mt-4">
            {currentLecture.title}
          </h2>

          {/* Classroom Tabs */}
          <div className="w-full border-b border-gray-200 dark:border-gray-800 mt-6 flex gap-6">
            {["Overview", "Resources", "Q&A Discussion", "Reviews"].map(
              (tabName, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`pb-3 font-Poppins font-medium text-sm transition-colors border-b-2 ${
                    activeTab === index
                      ? "border-[#37a39a] text-[#37a39a]"
                      : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {tabName}
                </button>
              )
            )}
          </div>

          {/* Tab 0: Overview */}
          {activeTab === 0 && (
            <div className="py-6">
              <h3 className="font-Poppins font-semibold text-lg text-black dark:text-white">
                About this lecture
              </h3>
              <p className="mt-2 text-sm sm:text-base font-Poppins text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentLecture.description}
              </p>
            </div>
          )}

          {/* Tab 1: Resources */}
          {activeTab === 1 && (
            <div className="py-6 space-y-3">
              <h3 className="font-Poppins font-semibold text-lg text-black dark:text-white">
                Lesson Resources
              </h3>
              {currentLecture.links.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900"
                >
                  <span className="text-sm font-Poppins text-black dark:text-white flex-1">
                    {link.title}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1.5 rounded bg-[#37a39a] text-white font-Poppins font-medium hover:bg-[#2b847d]"
                  >
                    Open Resource
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Q&A */}
          {activeTab === 2 && (
            <div className="py-6">
              <form onSubmit={handleAddQuestion} className="space-y-3">
                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about this lecture..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white font-Poppins text-sm outline-none focus:border-[#37a39a]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#37a39a] text-white font-Poppins text-sm font-medium hover:bg-[#2b847d]"
                >
                  Post Question
                </button>
              </form>

              <div className="mt-8 space-y-4">
                {questionsList.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900/60 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-Poppins font-semibold text-sm text-black dark:text-white">
                        {q.user.name}
                      </span>
                      <span className="text-xs text-gray-400 font-Poppins">
                        {q.createdAt}
                      </span>
                    </div>
                    <p className="text-sm font-Poppins text-gray-700 dark:text-gray-300">
                      {q.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 3 && (
            <div className="py-6">
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-Poppins text-black dark:text-white">
                    Rate this course:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AiFillStar
                      key={star}
                      size={22}
                      className={`cursor-pointer ${
                        star <= rating ? "text-[#f6b100]" : "text-gray-300 dark:text-gray-600"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your learning experience and feedback..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-black dark:text-white font-Poppins text-sm outline-none focus:border-[#37a39a]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#2190ff] text-white font-Poppins text-sm font-medium hover:bg-[#1a76d2]"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right sidebar: Course Curriculum Playlist */}
        <div className="w-full 1000px:w-[30%]">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-md">
            <h3 className="font-Poppins font-bold text-lg text-black dark:text-white mb-4">
              Course Content
            </h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {mockLectures.map((lec, index) => (
                <div
                  key={lec._id}
                  onClick={() => setActiveVideo(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-start gap-3 ${
                    activeVideo === index
                      ? "bg-[#37a39a]/10 border border-[#37a39a]"
                      : "bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {activeVideo === index ? (
                    <MdOutlineCheckCircle
                      size={20}
                      className="text-[#37a39a] mt-0.5 shrink-0"
                    />
                  ) : (
                    <MdOutlinePlayCircle
                      size={20}
                      className="text-gray-400 mt-0.5 shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h5
                      className={`font-Poppins text-xs sm:text-sm font-medium ${
                        activeVideo === index
                          ? "text-[#37a39a] font-semibold"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {lec.title}
                    </h5>
                    <span className="text-[11px] text-gray-500 font-Poppins">
                      {lec.videoLength} minutes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
