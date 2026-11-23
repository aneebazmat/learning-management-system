import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_SERVER_URI ||
      (typeof window !== "undefined" ? "/api/v1" : "http://localhost:5000/api/v1"),
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      let token = state?.auth?.token;
      if (!token && typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token") || "";
        } catch (_) {}
      }
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Courses", "Orders", "Analytics", "Notifications"],
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({}),
});
