"use client";
import React, { FC } from "react";
import { styles } from "../../../styles/style";

interface Props {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
}

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setCourseInfo({
          ...courseInfo,
          thumbnail: { url: e.target.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[85%] m-auto mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`${styles.label}`}>Course Name</label>
          <input
            type="text"
            required
            name="name"
            value={courseInfo.name}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="e.g. Next.js 14 Full Stack Industrial Bootcamp"
            className={`${styles.input}`}
          />
        </div>

        <div>
          <label htmlFor="description" className={`${styles.label}`}>Course Description</label>
          <textarea
            rows={4}
            required
            name="description"
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
            id="description"
            placeholder="Write a comprehensive description about curriculum outcomes..."
            className={`${styles.input} !h-min !py-2`}
          />
        </div>

        <div className="w-full flex justify-between gap-4">
          <div className="w-[50%]">
            <label htmlFor="price" className={`${styles.label}`}>Course Price (USD)</label>
            <input
              type="number"
              required
              name="price"
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: Number(e.target.value) })
              }
              id="price"
              placeholder="49"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="estimatedPrice" className={`${styles.label}`}>Estimated Price (USD)</label>
            <input
              type="number"
              name="estimatedPrice"
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({
                  ...courseInfo,
                  estimatedPrice: Number(e.target.value),
                })
              }
              id="estimatedPrice"
              placeholder="99"
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex justify-between gap-4">
          <div className="w-[50%]">
            <label htmlFor="tags" className={`${styles.label}`}>Course Tags</label>
            <input
              type="text"
              required
              name="tags"
              value={courseInfo.tags}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="Next.js, React, TypeScript, Redux"
              className={`${styles.input}`}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="course-level" className={`${styles.label}`}>Difficulty Level</label>
            <select
              id="course-level"
              name="level"
              value={courseInfo.level}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              className={`${styles.input} bg-transparent`}
            >
              <option value="Beginner" className="dark:bg-slate-900">Beginner</option>
              <option value="Intermediate" className="dark:bg-slate-900">Intermediate</option>
              <option value="Advanced" className="dark:bg-slate-900">Advanced</option>
              <option value="All Levels" className="dark:bg-slate-900">All Levels</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="demoUrl" className={`${styles.label}`}>Demo Video URL</label>
          <input
            type="text"
            required
            name="demoUrl"
            value={courseInfo.demoUrl}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
            }
            id="demoUrl"
            placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL"
            className={`${styles.input}`}
          />
        </div>

        <div>
          <label className={`${styles.label}`}>Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[15vh] dark:border-white border-[#00000026] p-4 border flex items-center justify-center rounded cursor-pointer mt-2 ${
              courseInfo.thumbnail?.url ? "bg-cover" : "bg-transparent"
            }`}
          >
            {courseInfo.thumbnail?.url ? (
              <img
                src={courseInfo.thumbnail.url}
                alt="thumbnail"
                className="max-h-[180px] w-full object-cover rounded"
              />
            ) : (
              <span className="text-black dark:text-white font-Poppins text-sm">
                Click or drag & drop thumbnail image here
              </span>
            )}
          </label>
        </div>

        <div className="w-full flex justify-end pt-4">
          <input
            id="course-info-submit"
            name="submit"
            type="submit"
            value="Next Step"
            className="w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-4 cursor-pointer font-Poppins font-medium hover:bg-[#2b847d] transition-colors"
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
