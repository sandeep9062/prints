import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🔐 Helper to get token (client only)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/orders`;

// 🔐 Attach Authorization header
const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // ✅ GET all orders (for merchant/admin)
    getOrdersByUser: builder.query<any, void>({
      query: () => ``,
      providesTags: ["Orders"],
    }),

    // ✅ GET order by ID
    getOrderById: builder.query<any, string>({
      query: (id) => `/${id}`,
      providesTags: ["Orders"],
    }),

    // ✅ UPDATE order status
    updateOrderStatus: builder.mutation<any, { id: string; orderStatus: string }>({
      query: ({ id, orderStatus }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { orderStatus },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

// 📌 Auto-generated hooks
export const {
  useGetOrdersByUserQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
