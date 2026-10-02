import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartItem } from "@/contexts/CartContext";

// 🔐 Helper to get token (client only)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/cart`;

// 🔐 Attach Authorization header
const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // ✅ GET user cart
    getCart: builder.query<{
      items: CartItem[];
      _id: string;
      user: string;
    }, void>({
      query: () => `/
      `,
      providesTags: ["Cart"],
    }),

    // ✅ Add item to cart
    addItemToCart: builder.mutation<any, Partial<CartItem> & { productId: string }>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Remove item from cart
    removeItemFromCart: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Update item quantity in cart
    updateCartItemQuantity: builder.mutation<any, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ Clear user cart
    clearCart: builder.mutation<any, void>({
      query: () => ({
        url: `/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemToCartMutation,
  useRemoveItemFromCartMutation,
  useUpdateCartItemQuantityMutation,
  useClearCartMutation,
} = cartApi;
