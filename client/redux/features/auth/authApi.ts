import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userLoaded } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "users/register",
        method: "POST",
        body: data,
      }),
    }),
    activation: builder.mutation({
      query: (data) => ({
        url: "users/activate",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user || null,
            })
          );
        } catch (error) {
          console.error("Login mutation error:", error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoaded({
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error("loadUser query failed:", error);
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "users/update-user-info",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "users/update-user-password",
        method: "PUT",
        body: data,
      }),
    }),
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: "users/update-user-avatar",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.query({
      query: () => ({
        url: "users/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useLazyLogoutQuery,
} = authApi;
