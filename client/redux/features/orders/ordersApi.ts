import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }: { courseId: string; payment_info?: any }) => ({
        url: "orders/create-order",
        method: "POST",
        body: { courseId, payment_info },
      }),
      invalidatesTags: ["Courses", "User", "Orders"],
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "orders/get-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = ordersApi;
