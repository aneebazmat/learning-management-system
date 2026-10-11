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
    }),
    getCourseDetails: builder.query({
      query: (id: string) => ({
        url: `courses/get-course/${id}`,
        method: "GET",
      }),
    }),
    getCourseContent: builder.query({
      query: (id: string) => ({
        url: `courses/get-course-content/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
} = coursesApi;
