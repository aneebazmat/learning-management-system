"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useEditCourseMutation } from "../../../../redux/features/courses/coursesApi";

interface Props {
  course: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCourseModal: FC<Props> = ({ course, onClose, onSuccess }) => {
  const [editCourse, { isLoading }] = useEditCourseMutation();
  const [activeTab, setActiveTab] = useState<"info" | "curriculum" | "prerequisites">("info");

  // Form State initialized from current course
  const [name, setName] = useState(course?.name || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState<number>(course?.price || 0);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(course?.estimatedPrice || 0);
  const [tags, setTags] = useState(course?.tags || "");
  const [level, setLevel] = useState(course?.level || "Beginner");
  const [demoUrl, setDemoUrl] = useState(course?.demoUrl || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail?.url || "");

  const [benefits, setBenefits] = useState<{ title: string }[]>(
    course?.benefits && course.benefits.length > 0
      ? course.benefits.map((b: any) => ({ title: b.title || "" }))
      : [{ title: "" }]
  );

  const [prerequisites, setPrerequisites] = useState<{ title: string }[]>(
    course?.prerequisites && course.prerequisites.length > 0
      ? course.prerequisites.map((p: any) => ({ title: p.title || "" }))
      : [{ title: "" }]
  );

  const [courseData, setCourseData] = useState<any[]>(
    course?.courseData && course.courseData.length > 0
      ? course.courseData.map((cd: any) => ({
          _id: cd._id,
          title: cd.title || "",
          videoUrl: cd.videoUrl || "",
          videoSection: cd.videoSection || "General",
          videoLength: cd.videoLength || 15,
          description: cd.description || "",
          links: cd.links || [{ title: "", url: "" }],
        }))
      : [
          {
            title: "",
            videoUrl: "",
            videoSection: "General",
            videoLength: 15,
            description: "",
            links: [{ title: "", url: "" }],
          },
        ]
  );

  // Handle benefits change
  const handleBenefitChange = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index].title = value;
    setBenefits(updated);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  // Handle prerequisites change
  const handlePrerequisiteChange = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index].title = value;
    setPrerequisites(updated);
  };

  const addPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const removePrerequisite = (index: number) => {
    if (prerequisites.length > 1) {
      setPrerequisites(prerequisites.filter((_, i) => i !== index));
    }
  };

  // Handle courseData / modules change
  const handleModuleChange = (index: number, field: string, value: any) => {
    const updated = [...courseData];
    updated[index] = { ...updated[index], [field]: value };
    setCourseData(updated);
  };

  const addModule = () => {
    setCourseData([
      ...courseData,
      {
        title: "",
        videoUrl: "",
        videoSection: `Module ${courseData.length + 1}`,
        videoLength: 20,
        description: "",
        links: [{ title: "", url: "" }],
      },
    ]);
  };

  const removeModule = (index: number) => {
    if (courseData.length > 1) {
      setCourseData(courseData.filter((_, i) => i !== index));
    }
  };

  // Submit updated details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Course name is required");
      setActiveTab("info");
      return;
    }

    if (!description.trim()) {
      toast.error("Course description is required");
      setActiveTab("info");
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      estimatedPrice: Number(estimatedPrice),
      tags,
      level,
      demoUrl,
      thumbnail: {
        url:
          thumbnailUrl ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      },
      benefits: benefits.filter((b) => b.title.trim() !== ""),
      prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
      courseData: courseData.map((mod) => ({
        ...mod,
        videoLength: Number(mod.videoLength) || 15,
      })),
    };

    try {
      await editCourse({ id: course._id, data: payload }).unwrap();
      toast.success("Course details updated successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update course details");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#37a39a]/15 text-[#37a39a]">
              <AiOutlineEdit size={22} />
            </div>
            <div>
              <h3 className="text-lg font-Poppins font-bold text-black dark:text-white">
                Edit Course Details
              </h3>
              <p className="text-xs text-gray-500 font-Poppins truncate max-w-sm">
                ID: {course?._id} • {course?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-gray-100 dark:border-gray-800 flex gap-6 bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
          {[
            { key: "info", label: "Basic Details & Pricing" },
            { key: "curriculum", label: `Curriculum (${courseData.length} Lectures)` },
            { key: "prerequisites", label: "Benefits & Prerequisites" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 text-xs sm:text-sm font-Poppins font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#37a39a] text-[#37a39a]"
                  : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tab 1: Basic Details & Pricing */}
          {activeTab === "info" && (
            <div className="space-y-4 font-Poppins">
              <div>
                <label htmlFor="edit-course-name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Course Title / Name *
                </label>
                <input
                  id="edit-course-name"
                  name="courseName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js 14 & Redux Full Stack Masterclass"
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-course-description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Course Description *
                </label>
                <textarea
                  id="edit-course-description"
                  name="courseDescription"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed overview of what this course delivers..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-course-price" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Price (USD $) *
                  </label>
                  <input
                    id="edit-course-price"
                    name="coursePrice"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-course-estimated-price" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Estimated / Original Price (USD $)
                  </label>
                  <input
                    id="edit-course-estimated-price"
                    name="courseEstimatedPrice"
                    type="number"
                    min="0"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-course-tags" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tags / Category
                  </label>
                  <input
                    id="edit-course-tags"
                    name="courseTags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. Next.js, React, Full Stack, Python"
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-course-level" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="edit-course-level"
                    name="courseLevel"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                  >
                    <option value="Beginner" className="dark:bg-slate-900">Beginner</option>
                    <option value="Intermediate" className="dark:bg-slate-900">Intermediate</option>
                    <option value="Expert" className="dark:bg-slate-900">Expert</option>
                    <option value="All Levels" className="dark:bg-slate-900">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="edit-course-demo-url" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Demo Video URL (YouTube, Vimeo, MP4)
                </label>
                <input
                  id="edit-course-demo-url"
                  name="courseDemoUrl"
                  type="text"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                />
              </div>

              <div>
                <label htmlFor="edit-course-thumbnail-url" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  id="edit-course-thumbnail-url"
                  name="courseThumbnailUrl"
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-black dark:text-white outline-none focus:border-[#37a39a]"
                />
                {thumbnailUrl && (
                  <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Curriculum / CourseData */}
          {activeTab === "curriculum" && (
            <div className="space-y-4 font-Poppins">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Course Modules & Video Lectures
                </span>
                <button
                  type="button"
                  onClick={addModule}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#37a39a] text-white text-xs font-medium hover:bg-[#2b847d] transition-colors"
                >
                  <AiOutlinePlus size={14} /> Add Lecture
                </button>
              </div>

              <div className="space-y-4">
                {courseData.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-slate-800/40 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#37a39a]">
                        Lesson #{idx + 1}
                      </span>
                      {courseData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(idx)}
                          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                        >
                          <AiOutlineDelete size={15} /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`edit-lecture-title-${idx}`} className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                          Lecture Title *
                        </label>
                        <input
                          id={`edit-lecture-title-${idx}`}
                          name={`lecture_title_${idx}`}
                          type="text"
                          value={item.title}
                          onChange={(e) => handleModuleChange(idx, "title", e.target.value)}
                          placeholder="e.g. 1. Introduction to FastAPI"
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-lecture-section-${idx}`} className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                          Section / Module Name
                        </label>
                        <input
                          id={`edit-lecture-section-${idx}`}
                          name={`lecture_section_${idx}`}
                          type="text"
                          value={item.videoSection}
                          onChange={(e) => handleModuleChange(idx, "videoSection", e.target.value)}
                          placeholder="e.g. Module 1: Foundations"
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor={`edit-lecture-url-${idx}`} className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                          Video Stream URL (YouTube, Vimeo, MP4) *
                        </label>
                        <input
                          id={`edit-lecture-url-${idx}`}
                          name={`lecture_url_${idx}`}
                          type="text"
                          value={item.videoUrl}
                          onChange={(e) => handleModuleChange(idx, "videoUrl", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-lecture-length-${idx}`} className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                          Duration (Minutes)
                        </label>
                        <input
                          id={`edit-lecture-length-${idx}`}
                          name={`lecture_length_${idx}`}
                          type="number"
                          min="1"
                          value={item.videoLength}
                          onChange={(e) => handleModuleChange(idx, "videoLength", e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`edit-lecture-desc-${idx}`} className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                        Lesson Description
                      </label>
                      <input
                        id={`edit-lecture-desc-${idx}`}
                        name={`lecture_desc_${idx}`}
                        type="text"
                        value={item.description}
                        onChange={(e) => handleModuleChange(idx, "description", e.target.value)}
                        placeholder="Brief overview of concepts covered in this lesson..."
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Benefits & Prerequisites */}
          {activeTab === "prerequisites" && (
            <div className="space-y-6 font-Poppins">
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    What will students learn from this course? (Benefits)
                  </label>
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-xs text-[#37a39a] hover:underline flex items-center gap-1 font-medium"
                  >
                    <AiOutlinePlus size={13} /> Add Benefit
                  </button>
                </div>
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      id={`edit-benefit-${idx}`}
                      name={`benefit_${idx}`}
                      type="text"
                      value={b.title}
                      onChange={(e) => handleBenefitChange(idx, e.target.value)}
                      placeholder="e.g. Master production full-stack architecture"
                      className="flex-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                    />
                    {benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="p-2 text-red-500 hover:text-red-600"
                        title="Remove benefit"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Prerequisites */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Prerequisites for taking this course
                  </label>
                  <button
                    type="button"
                    onClick={addPrerequisite}
                    className="text-xs text-[#37a39a] hover:underline flex items-center gap-1 font-medium"
                  >
                    <AiOutlinePlus size={13} /> Add Prerequisite
                  </button>
                </div>
                {prerequisites.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      id={`edit-prereq-${idx}`}
                      name={`prereq_${idx}`}
                      type="text"
                      value={p.title}
                      onChange={(e) => handlePrerequisiteChange(idx, e.target.value)}
                      placeholder="e.g. Basic understanding of JavaScript syntax"
                      className="flex-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-black dark:text-white outline-none focus:border-[#37a39a]"
                    />
                    {prerequisites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrerequisite(idx)}
                        className="p-2 text-red-500 hover:text-red-600"
                        title="Remove prerequisite"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-400 font-Poppins">
              All changes are synced live to MongoDB Atlas.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-Poppins border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg text-sm font-Poppins bg-[#37a39a] hover:bg-[#2b847d] text-white font-medium shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <BsCheckCircle size={15} />
                    <span>Save Course Details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
