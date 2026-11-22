"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useDeleteCourseModuleMutation,
} from "../../../../redux/features/courses/coursesApi";
import {
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { toast } from "react-hot-toast";
import EditCourseModal from "./EditCourseModal";

interface Props {}

const AllCourses: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetAllCoursesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteCourse, { isLoading: isDeletingCourse }] = useDeleteCourseMutation();
  const [deleteCourseModule, { isLoading: isDeletingModule }] = useDeleteCourseModuleMutation();

  // State for deleting entire course
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  // State for editing course details
  const [courseToEdit, setCourseToEdit] = useState<any | null>(null);

  // State for inspecting and deleting individual modules
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<{
    courseId: string;
    moduleId: string;
    title: string;
  } | null>(null);

  const courses = data?.courses || [];

  const handleConfirmDeleteCourse = async () => {
    if (!courseToDelete?._id) return;
    try {
      await deleteCourse(courseToDelete._id).unwrap();
      toast.success(`Course "${courseToDelete.name}" deleted successfully`);
      setCourseToDelete(null);
      if (selectedCourse?._id === courseToDelete._id) {
        setSelectedCourse(null);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  const handleConfirmDeleteModule = async () => {
    if (!moduleToDelete) return;
    try {
      const res = await deleteCourseModule({
        courseId: moduleToDelete.courseId,
        moduleId: moduleToDelete.moduleId,
      }).unwrap();

      toast.success(`Module "${moduleToDelete.title}" deleted successfully`);
      setModuleToDelete(null);

      // Update the local modal view with the returned updated course
      if (res?.course) {
        setSelectedCourse(res.course);
      } else if (selectedCourse) {
        setSelectedCourse({
          ...selectedCourse,
          courseData: selectedCourse.courseData.filter(
            (item: any) => item._id !== moduleToDelete.moduleId
          ),
        });
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete module");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white">
            All Live Courses & Modules
          </h2>
          <p className="text-sm font-Poppins text-gray-500">
            Inspect, manage, edit details, and delete courses across the platform.
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
              <th className="p-4">Modules</th>
              <th className="p-4">Students</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {courses.length > 0 ? (
              courses.map((course: any) => (
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
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-black dark:text-white max-w-xs block truncate">
                        {course.name}
                      </span>
                      <span className="text-xs text-gray-400">ID: {course._id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-black dark:text-white">
                    ${course.price}
                  </td>
                  <td className="p-4 text-[#f6b100] font-medium">
                    ★ {course.ratings || 5.0}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-[#37a39a]/10 text-[#37a39a] font-medium">
                      {course.courseData?.length || 0} Modules
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {course.purchased || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/course/${course._id}`}
                        prefetch={true}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-[#37a39a] transition-colors"
                        title="View Public Course Page"
                      >
                        <AiOutlineEye size={19} />
                      </Link>
                      <button
                        onClick={() => setCourseToEdit(course)}
                        className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-500 hover:text-amber-600 transition-colors"
                        title="Edit Course Details & Curriculum"
                      >
                        <AiOutlineEdit size={19} />
                      </button>
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-blue-500 transition-colors"
                        title="Inspect & Manage Course Modules"
                      >
                        <MdOutlineVideoLibrary size={19} />
                      </button>
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete Entire Course"
                      >
                        <AiOutlineDelete size={19} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  {isLoading ? "Loading courses..." : "No live courses found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Course Deletion Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-Poppins font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AiOutlineDelete size={22} />
                Delete Course
              </h3>
              <button
                onClick={() => setCourseToDelete(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <AiOutlineClose size={18} />
              </button>
            </div>
            <div className="py-4 font-Poppins text-sm text-gray-600 dark:text-gray-300">
              <p>Are you sure you want to permanently delete the course:</p>
              <p className="font-semibold text-black dark:text-white mt-1">
                &ldquo;{courseToDelete.name}&rdquo;?
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-3">
                This action is irreversible and will delete all modules, student progress, and lecture media associated with this course.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                disabled={isDeletingCourse}
                className="px-4 py-2 rounded-lg text-sm font-Poppins border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                disabled={isDeletingCourse}
                className="px-4 py-2 rounded-lg text-sm font-Poppins bg-red-600 hover:bg-red-700 text-white font-medium shadow-md disabled:opacity-50"
              >
                {isDeletingCourse ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modules Inspector & Manager Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-Poppins font-bold text-black dark:text-white flex items-center gap-2">
                  <MdOutlineVideoLibrary className="text-[#37a39a]" size={22} />
                  Course Modules & Lectures
                </h3>
                <p className="text-xs text-gray-500 font-Poppins truncate max-w-md">
                  {selectedCourse.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3 font-Poppins">
              {selectedCourse.courseData && selectedCourse.courseData.length > 0 ? (
                selectedCourse.courseData.map((moduleItem: any, idx: number) => (
                  <div
                    key={moduleItem._id || idx}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                          {moduleItem.videoSection || `Module ${idx + 1}`}
                        </span>
                        {moduleItem.videoLength ? (
                          <span className="text-xs text-gray-400">
                            {moduleItem.videoLength} mins
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-sm font-semibold text-black dark:text-white mt-1 truncate">
                        {moduleItem.title || "Untitled Lecture"}
                      </h4>
                      {moduleItem.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {moduleItem.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setModuleToDelete({
                          courseId: selectedCourse._id,
                          moduleId: moduleItem._id,
                          title: moduleItem.title || `Module ${idx + 1}`,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-center gap-1 shrink-0 transition-colors"
                      title="Delete this module"
                    >
                      <AiOutlineDelete size={15} />
                      Delete Module
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No modules found in this course.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg text-sm font-Poppins bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Deletion Confirmation Modal */}
      {moduleToDelete && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-Poppins font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AiOutlineDelete size={22} />
                Delete Module
              </h3>
              <button
                onClick={() => setModuleToDelete(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <AiOutlineClose size={18} />
              </button>
            </div>
            <div className="py-4 font-Poppins text-sm text-gray-600 dark:text-gray-300">
              <p>Are you sure you want to delete the module lecture:</p>
              <p className="font-semibold text-black dark:text-white mt-1">
                &ldquo;{moduleToDelete.title}&rdquo;?
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-3">
                This module and its video stream will be permanently removed from this course.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setModuleToDelete(null)}
                disabled={isDeletingModule}
                className="px-4 py-2 rounded-lg text-sm font-Poppins border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteModule}
                disabled={isDeletingModule}
                className="px-4 py-2 rounded-lg text-sm font-Poppins bg-red-600 hover:bg-red-700 text-white font-medium shadow-md disabled:opacity-50"
              >
                {isDeletingModule ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Edit Modal */}
      {courseToEdit && (
        <EditCourseModal
          course={courseToEdit}
          onClose={() => setCourseToEdit(null)}
          onSuccess={() => {
            setCourseToEdit(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default AllCourses;
