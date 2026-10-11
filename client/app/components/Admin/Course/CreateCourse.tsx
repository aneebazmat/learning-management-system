"use client";
import React, { FC, useState, useEffect } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseContentData from "./CourseContentData";
import CoursePreview from "./CoursePreview";
import { useCreateCourseMutation } from "../../../../redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";

interface Props {
  setActiveNav?: (active: number) => void;
}

const CreateCourse: FC<Props> = ({ setActiveNav }) => {
  const [active, setActive] = useState(0);
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();

  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: 49,
    estimatedPrice: 99,
    tags: "",
    level: "Beginner",
    demoUrl: "",
    thumbnail: { url: "" },
  });

  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Module 1: Introduction",
      videoLength: 15,
      links: [{ title: "", url: "" }],
    },
  ]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!");
      if (setActiveNav) {
        setActiveNav(3); // Switch to live courses view
      }
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || "Failed to create course");
      } else {
        toast.error("Error creating course");
      }
    }
  }, [isSuccess, error, setActiveNav]);

  const handleCourseCreate = async () => {
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      benefits,
      prerequisites,
      courseData: courseContentData,
    };
    await createCourse(data);
  };

  const steps = [
    "1. Information",
    "2. Options",
    "3. Content",
    "4. Preview",
  ];

  return (
    <div className="w-full flex min-h-screen p-6">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseOptions
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContentData
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={{
              ...courseInfo,
              benefits,
              prerequisites,
              courseData: courseContentData,
            }}
            handleCourseCreate={handleCourseCreate}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Progress stepper column */}
      <div className="w-[20%] mt-[60px] h-[300px] sticky top-[100px] border-l border-gray-200 dark:border-gray-800 pl-4 font-Poppins">
        <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">
          Creation Progress
        </h4>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => index < active && setActive(index)}
              className={`flex items-center gap-2 text-sm cursor-pointer ${
                active === index
                  ? "text-[#37a39a] font-bold"
                  : index < active
                  ? "text-emerald-500 font-medium"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  active === index
                    ? "bg-[#37a39a] text-white"
                    : index < active
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
