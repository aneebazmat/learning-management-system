"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import CoursePlayer from "./CoursePlayer";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
import { MdOutlinePlayCircle, MdOutlineCheckCircle } from "react-icons/md";
import { BiLockAlt } from "react-icons/bi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetCourseContentQuery,
  useGetCourseDetailsQuery,
  useAddReviewMutation,
} from "../../../redux/features/courses/coursesApi";
import { getSafeAvatar } from "../../utils/avatar";
import { formatTimeAgo } from "../../utils/timeAgo";

interface Props {
  id: string;
  user: any;
}

const CourseContent: FC<Props> = ({ id, user }) => {
  const router = useRouter();
  const { data: contentData, isLoading, error } = useGetCourseContentQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const { data: courseDetailsData, refetch: refetchCourseDetails } =
    useGetCourseDetailsQuery(id, {
      refetchOnMountOrArgChange: true,
    });

  const [addReviewMutation, { isLoading: isSubmittingReview }] = useAddReviewMutation();

  const [activeVideo, setActiveVideo] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0 = Overview, 1 = Resources, 2 = Q&A, 3 = Reviews
  const [question, setQuestion] = useState("");
  const [questionsList, setQuestionsList] = useState<any[]>([
    {
      user: { name: "Zainab Tariq" },
      question: "How do we handle JWT token expiration on the client gracefully?",
      createdAt: "2 days ago",
    },
  ]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const lectures: any[] = contentData?.content || [];
  const courseReviews: any[] = courseDetailsData?.course?.reviews || [];

  // Reset activeVideo if out of range
  useEffect(() => {
    if (activeVideo >= lectures.length && lectures.length > 0) {
      setActiveVideo(0);
    }
  }, [lectures.length, activeVideo]);

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

  const handleAddReview = async (e: any) => {
    e.preventDefault();
    if (review.trim() === "") {
      toast.error("Please enter your review text");
      return;
    }
    try {
      await addReviewMutation({
        courseId: id,
        review: review.trim(),
        rating,
      }).unwrap();
      toast.success("Review submitted successfully! Thank you for your feedback.");
      setReview("");
      refetchCourseDetails();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-[92%] m-auto py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#37a39a] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-Poppins text-gray-500 dark:text-gray-400 text-sm">
          Loading course content and lectures...
        </p>
      </div>
    );
  }

  // Not enrolled or permission error
  if (error) {
    const isForbidden = (error as any)?.status === 403;
    return (
      <div className="w-[90%] max-w-[650px] m-auto py-20 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BiLockAlt size={32} />
        </div>
        <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white mb-2">
          {isForbidden ? "Enrollment Required" : "Access Unavailable"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-Poppins text-sm sm:text-base leading-relaxed mb-6">
          {isForbidden
            ? "You need to enroll in this course to access its video lectures, resources, and curriculum."
            : "An error occurred while loading this course's content. Please check your connection or enrollment status."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/course/${id}`}
            prefetch={true}
            className="px-6 py-2.5 rounded-full bg-[#37a39a] text-white font-Poppins text-sm font-medium hover:bg-[#2b847d] transition-colors"
          >
            Go to Course Page
          </Link>
          <Link
            href="/courses"
            prefetch={true}
            className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-black dark:text-white font-Poppins text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  // Empty course content
  if (lectures.length === 0) {
    return (
      <div className="w-[90%] max-w-[650px] m-auto py-20 text-center">
        <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white mb-2">
          No Lectures Available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-Poppins text-sm leading-relaxed mb-6">
          The instructor has not added video lessons to this course yet. Please check back later.
        </p>
        <Link
          href={`/course/${id}`}
          prefetch={true}
          className="inline-block px-6 py-2.5 rounded-full bg-[#37a39a] text-white font-Poppins text-sm font-medium hover:bg-[#2b847d]"
        >
          Return to Course
        </Link>
      </div>
    );
  }

  const currentLecture = lectures[activeVideo] || lectures[0];

  return (
    <div className="w-[92%] m-auto py-8">
      <div className="w-full flex flex-col 1000px:flex-row gap-8">
        {/* Main video player and discussion tabs */}
        <div className="w-full 1000px:w-[70%]">
          <CoursePlayer
            videoUrl={currentLecture?.videoUrl}
            title={currentLecture?.title}
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
              disabled={activeVideo === lectures.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-Poppins text-sm ${
                activeVideo === lectures.length - 1
                  ? "opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500"
                  : "bg-[#2190ff] text-white hover:bg-[#1a76d2]"
              }`}
            >
              Next Lesson <AiOutlineArrowRight size={16} />
            </button>
          </div>

          <div className="mt-4">
            {currentLecture?.videoSection && (
              <span className="text-xs font-Poppins text-[#37a39a] uppercase tracking-wider font-semibold">
                {currentLecture.videoSection}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-Poppins font-bold text-black dark:text-white mt-1">
              {currentLecture?.title}
            </h2>
          </div>

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
              <p className="mt-2 text-sm sm:text-base font-Poppins text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {currentLecture?.description ||
                  "In this lecture, you will explore core concepts and practical workflows designed to advance your mastery."}
              </p>
            </div>
          )}

          {/* Tab 1: Resources */}
          {activeTab === 1 && (
            <div className="py-6 space-y-3">
              <h3 className="font-Poppins font-semibold text-lg text-black dark:text-white">
                Lesson Resources
              </h3>
              {currentLecture?.links && currentLecture.links.length > 0 ? (
                currentLecture.links.map((link: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900"
                  >
                    <span className="text-sm font-Poppins text-black dark:text-white flex-1">
                      {link.title || link.url}
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
                ))
              ) : (
                <p className="text-sm font-Poppins text-gray-500 dark:text-gray-400 py-3">
                  No additional downloadable resources for this lecture.
                </p>
              )}
            </div>
          )}

          {/* Tab 2: Q&A */}
          {activeTab === 2 && (
            <div className="py-6">
              <form onSubmit={handleAddQuestion} className="space-y-3">
                <textarea
                  id="lecture-question-input"
                  name="question"
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
            <div className="py-6 space-y-8">
              {/* Review Submission Form */}
              <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h4 className="font-Poppins font-bold text-base text-black dark:text-white">
                  Leave a Review
                </h4>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-Poppins text-black dark:text-white">
                      Your Rating:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <AiFillStar
                          key={star}
                          size={22}
                          className={`cursor-pointer transition-transform hover:scale-110 ${
                            star <= rating ? "text-[#f6b100]" : "text-gray-300 dark:text-gray-600"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-Poppins text-gray-500 font-medium">
                      ({rating} out of 5 stars)
                    </span>
                  </div>
                  <textarea
                    id="course-review-input"
                    name="review"
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share what you learned, instructor strengths, and suggestions..."
                    className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-black dark:text-white font-Poppins text-sm outline-none focus:border-[#37a39a] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-xl bg-[#37a39a] hover:bg-[#2b837b] text-white font-Poppins text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting Review..." : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* Dynamic Course Reviews List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-Poppins font-bold text-lg text-black dark:text-white">
                    Learner Feedback ({courseReviews.length})
                  </h4>
                  <span className="text-xs font-Poppins text-gray-500 font-medium">
                    Verified Course Reviews
                  </span>
                </div>

                {courseReviews.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50">
                    <AiFillStar size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="font-Poppins text-sm font-medium text-black dark:text-white">
                      No reviews yet for this course
                    </p>
                    <p className="text-xs font-Poppins text-gray-400 mt-1">
                      Be the first student to review this syllabus module!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courseReviews.map((rev: any, index: number) => (
                      <div
                        key={rev._id || index}
                        className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#37a39a]">
                              <Image
                                src={getSafeAvatar(rev.user?.avatar?.url)}
                                alt={rev.user?.name || "Student"}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-Poppins font-semibold text-xs text-black dark:text-white">
                                {rev.user?.name || "Verified Student"}
                              </p>
                              <span className="text-[10px] text-gray-400 font-Poppins">
                                {formatTimeAgo(rev.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 text-[#f6b100]">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <AiFillStar key={i} size={15} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs font-Poppins text-gray-700 dark:text-gray-300 leading-relaxed pl-11">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: Course Curriculum Playlist */}
        <div className="w-full 1000px:w-[30%]">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-Poppins font-bold text-lg text-black dark:text-white">
                Course Content
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-[#37a39a]/15 text-[#37a39a] font-Poppins font-medium">
                {lectures.length} {lectures.length === 1 ? "Lesson" : "Lessons"}
              </span>
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {lectures.map((lec: any, index: number) => (
                <div
                  key={lec._id || index}
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
                  <div className="flex-1 min-w-0">
                    {lec.videoSection && (
                      <span className="block text-[11px] font-Poppins text-gray-400 truncate mb-0.5">
                        {lec.videoSection}
                      </span>
                    )}
                    <h5
                      className={`font-Poppins text-xs sm:text-sm font-medium truncate ${
                        activeVideo === index
                          ? "text-[#37a39a] font-semibold"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {index + 1}. {lec.title}
                    </h5>
                    {lec.videoLength && (
                      <span className="text-[11px] text-gray-500 font-Poppins">
                        {lec.videoLength} minutes
                      </span>
                    )}
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
