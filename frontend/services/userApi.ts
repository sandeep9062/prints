import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

// ✅ Interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  password?: string;
  role: string;
  isActive: boolean;
  googleId?: string;
  profile?: Record<string, any>;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  createdAt: string;
  // NOTE: `favProperties` does NOT exist on the user document — favourites are
  // stored in a separate `Wishlist` collection. Use `getFavourites`.
  bookedVisits: any[];
  ownedProperties: any[];
}

interface UpdateUserPayload {
  id: string;
  data: Partial<User>;
}

interface ToggleUserStatusPayload {
  id: string;
  isActive: boolean;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
  image?: string;
  orderStats: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
  };
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ✅ Get all users
    getUsers: builder.query<User[], void>({
      query: () => `/v1/users`,
      providesTags: ["User"],
      transformResponse: (response: { success: boolean; users: User[] }) =>
        response.users,
    }),

    // ✅ Get single user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/v1/users/${id}`,
      providesTags: (result, error, id) => ["User", { type: "User", id }],
      transformResponse: (response: { success: boolean; user: User }) =>
        response.user,
    }),

    // ✅ Create a new user
    addUser: builder.mutation<Partial<User>, Partial<User>>({
      query: (data) => ({
        url: `/v1/users`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Update user
    updateUser: builder.mutation<User, UpdateUserPayload>({
      query: ({ id, data }) => ({
        url: `/v1/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "User",
        { type: "User", id },
      ],
      transformResponse: (response: { success: boolean; user: User }) =>
        response.user,
    }),

    // ✅ Delete user
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/v1/users/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => ["User", { type: "User", id }],
      },
    ),

    // ✅ Toggle active/inactive status
    toggleUserStatus: builder.mutation<User, ToggleUserStatusPayload>({
      query: ({ id, isActive }) => ({
        url: `/v1/users/${id}/toggle`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        "User",
        { type: "User", id },
      ],
    }),

    // ✅ Filter users by role
    getUsersByRole: builder.query<User[], string>({
      query: (role) => `/v1/users/role/${role}`,
      providesTags: ["User"],
      transformResponse: (response: { users: User[] }) => response.users,
    }),

    // ✅ Add/Remove Favourite
    // NOTE: favourites live in a separate `Wishlist` collection on the backend,
    // NOT on the user document. The single source of truth reachable from the
    // client is `getFavourites`, so that is the cache we optimistically patch.
    toFav: builder.mutation<
      { success: boolean; message: string; wishlist: string[] },
      { id: string; product: any }
    >({
      query: ({ id }) => ({
        url: `/v1/users/toFav/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted({ id, product }, { dispatch, queryFulfilled }) {
        if (!id) return;

        const patchResult = dispatch(
          userApi.util.updateQueryData("getFavourites", undefined, (draft) => {
            if (!Array.isArray(draft)) return;

            const existing = draft.findIndex(
              (fav: any) => fav?._id === id || fav?.id === id,
            );

            if (existing > -1) {
              // Already favourited -> this call removes it.
              draft.splice(existing, 1);
            } else if (product) {
              // Not favourited -> this call adds it.
              draft.push(product);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          // Roll the optimistic update back if the request failed.
          patchResult.undo();
        }
      },
    }),

    // ✅ Get all favourite properties of a user
    getFavourites: builder.query<any[], void>({
      query: () => `/v1/users/favourites`,
      providesTags: ["User"],
      transformResponse: (response: { success: boolean; favourites: any[] }) =>
        response?.favourites ?? [],
    }),

    // ✅ Get all bookings of a user
    getBookings: builder.query<any[], void>({
      query: () => `/v1/users/bookings`,
      providesTags: ["User"],
    }),

    // ✅ Update profile
    updateProfile: builder.mutation<User, FormData>({
      query: (data) => ({
        url: `/v1/users/profile-update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "User",
        { type: "User", id: result?._id },
      ],
      transformResponse: (response: { success: boolean; user: User }) =>
        response.user,
    }),

    // ✅ Get all customers (for merchants)
    getAllCustomers: builder.query<Customer[], void>({
      query: () => `/v1/users/customers/all`,
      providesTags: ["User"],
      transformResponse: (response: { customers: Customer[] }) =>
        response.customers,
    }),

    // ✅ Get customer by ID with details (for merchants)
    getCustomerById: builder.query<any, string>({
      query: (id) => `/v1/users/customers/${id}`,
      providesTags: (result, error, id) => ["User", { type: "User", id }],
    }),

    // ✅ Get my orders (logged-in user)
    getMyOrders: builder.query<{ success: boolean; orders: any[] }, void>({
      query: () => `/v1/users/my-orders`,
      providesTags: ["User"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetUsersByRoleQuery,

  useToFavMutation,
  useGetFavouritesQuery,
  useGetBookingsQuery,
  useUpdateProfileMutation,

  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useGetMyOrdersQuery,
} = userApi;
