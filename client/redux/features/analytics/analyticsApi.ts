import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "analytics/users",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "analytics/courses",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "analytics/orders",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getAnalyticsOverview: builder.query({
      query: () => ({
        url: "analytics/overview",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetUsersAnalyticsQuery,
  useGetCoursesAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetAnalyticsOverviewQuery,
} = analyticsApi;
