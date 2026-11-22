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
    socialAuth: builder.mutation({
      query: (data: { email: string; name: string; avatar?: string }) => ({
        url: "users/social-auth",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
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
          console.error("Social auth mutation error:", error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 300,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(
              userLoaded({
                user: result.data.user,
              })
            );
          }
        } catch (error: any) {
          console.error("loadUser query failed:", error);
          if (error?.error?.status === 401) {
            dispatch(userLoggedOut());
          }
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoaded({ user: result.data.user }));
          }
        } catch (_) {}
      },
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoaded({ user: result.data.user }));
          }
        } catch (_) {}
      },
    }),
    logout: builder.query({
      query: () => ({
        url: "users/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout request notice:", error);
        } finally {
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "users/all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: (data: { id?: string; email?: string; role: string }) => ({
        url: "users/update-user-role",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `users/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLoadUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useLazyLogoutQuery,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = authApi;
