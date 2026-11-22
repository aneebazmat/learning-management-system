import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "courses/create-course",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "courses/get-courses",
        method: "GET",
      }),
      providesTags: ["Courses"],
      keepUnusedDataFor: 300,
    }),
    getCourseDetails: builder.query({
      query: (id: string) => ({
        url: `courses/get-course/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
    }),
    getCourseContent: builder.query({
      query: (id: string) => ({
        url: `courses/get-course-content/${id}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `courses/delete-course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourseModule: builder.mutation({
      query: ({ courseId, moduleId }: { courseId: string; moduleId: string }) => ({
        url: `courses/delete-module/${courseId}/${moduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
    editCourse: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `courses/edit-course/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
    addReview: builder.mutation({
      query: ({ courseId, review, rating }: { courseId: string; review: string; rating: number }) => ({
        url: `courses/add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
      }),
      invalidatesTags: ["Courses"],
    }),
    getAllReviews: builder.query({
      query: () => ({
        url: "courses/all-reviews",
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useEditCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useDeleteCourseMutation,
  useDeleteCourseModuleMutation,
  useAddReviewMutation,
  useGetAllReviewsQuery,
} = coursesApi;
