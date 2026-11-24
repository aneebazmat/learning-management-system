import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = (): string => {
  // If running in browser:
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // When running locally in development:
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      return (
        process.env.NEXT_PUBLIC_SERVER_URI &&
        process.env.NEXT_PUBLIC_SERVER_URI.startsWith("http")
          ? process.env.NEXT_PUBLIC_SERVER_URI
          : "http://localhost:5000/api/v1"
      );
    }
    // In production (Render, custom domain, etc.), use relative /api/v1 so Next.js handles reverse proxying
    return "/api/v1";
  }

  // Server-side rendering (SSR) / build time
  const backendPort = process.env.SERVER_PORT || process.env.EXPRESS_PORT || "5000";
  return process.env.NEXT_PUBLIC_SERVER_URI || `http://127.0.0.1:${backendPort}/api/v1`;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
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
