import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "notifications/get-all-notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    updateNotificationStatus: builder.mutation({
      query: (id: string) => ({
        url: `notifications/update-notification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
