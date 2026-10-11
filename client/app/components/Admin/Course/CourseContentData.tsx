"use client";
import React, { FC } from "react";
import { styles } from "../../../styles/style";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";

interface Props {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any[];
  setCourseContentData: (data: any[]) => void;
}

const CourseContentData: FC<Props> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
}) => {
  const handleAddVideo = () => {
    setCourseContentData([
      ...courseContentData,
      {
        videoUrl: "",
        title: "",
        description: "",
        videoSection: courseContentData[courseContentData.length - 1]?.videoSection || "Untitled Section",
        videoLength: 15,
        links: [{ title: "", url: "" }],
      },
    ]);
  };

  const handleDeleteVideo = (index: number) => {
    if (courseContentData.length > 1) {
      setCourseContentData(courseContentData.filter((_, i) => i !== index));
    }
  };

  const handleVideoChange = (index: number, field: string, value: any) => {
    const updated = [...courseContentData];
    updated[index] = { ...updated[index], [field]: value };
    setCourseContentData(updated);
  };

  const handleNext = () => {
    const lastItem = courseContentData[courseContentData.length - 1];
    if (lastItem.title === "" || lastItem.videoUrl === "") {
      toast.error("Please fill in the lecture title and video URL");
      return;
    }
    setActive(active + 1);
  };

  return (
    <div className="w-[85%] m-auto mt-6">
      {courseContentData.map((item: any, index: number) => (
        <div
          key={index}
          className="w-full bg-gray-50 dark:bg-slate-900/60 p-5 rounded-xl border border-gray-200 dark:border-gray-800 mb-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-Poppins font-semibold text-lg text-[#37a39a]">
              Lecture {index + 1}
            </h4>
            {courseContentData.length > 1 && (
              <AiOutlineDelete
                className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                size={22}
                onClick={() => handleDeleteVideo(index)}
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className={`${styles.label}`}>Section Title</label>
              <input
                type="text"
                className={`${styles.input}`}
                placeholder="e.g. Module 1: System Design & Setup"
                value={item.videoSection}
                onChange={(e) =>
                  handleVideoChange(index, "videoSection", e.target.value)
                }
              />
            </div>

            <div>
              <label className={`${styles.label}`}>Lecture Title</label>
              <input
                type="text"
                className={`${styles.input}`}
                placeholder="e.g. Project Overview & Folder Architecture"
                value={item.title}
                onChange={(e) =>
                  handleVideoChange(index, "title", e.target.value)
                }
              />
            </div>

            <div className="flex gap-4">
              <div className="w-[70%]">
                <label className={`${styles.label}`}>Video URL</label>
                <input
                  type="text"
                  className={`${styles.input}`}
                  placeholder="https://... (YouTube, Vimeo, MP4)"
                  value={item.videoUrl}
                  onChange={(e) =>
                    handleVideoChange(index, "videoUrl", e.target.value)
                  }
                />
              </div>
              <div className="w-[30%]">
                <label className={`${styles.label}`}>Duration (Mins)</label>
                <input
                  type="number"
                  className={`${styles.input}`}
                  placeholder="15"
                  value={item.videoLength}
                  onChange={(e) =>
                    handleVideoChange(index, "videoLength", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div>
              <label className={`${styles.label}`}>Lecture Description</label>
              <textarea
                rows={3}
                className={`${styles.input} !h-min !py-2`}
                placeholder="Brief summary of what this lecture teaches..."
                value={item.description}
                onChange={(e) =>
                  handleVideoChange(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div
        className="flex items-center gap-2 cursor-pointer text-[#37a39a] hover:text-[#2b847d] font-Poppins font-medium"
        onClick={handleAddVideo}
      >
        <AiOutlinePlusCircle size={24} />
        <span>Add Another Lecture</span>
      </div>

      <div className="w-full flex items-center justify-between pt-8">
        <button
          onClick={() => setActive(active - 1)}
          className="w-[180px] h-[40px] bg-gray-500 text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded cursor-pointer font-Poppins font-medium hover:bg-[#2b847d] transition-colors"
        >
          Next: Preview
        </button>
      </div>
    </div>
  );
};

export default CourseContentData;
