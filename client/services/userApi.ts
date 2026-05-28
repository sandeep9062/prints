import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser } from "../store/authSlice";
import { RootState } from "../store/store";
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
  favProperties: any[];
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
    toFav: builder.mutation<User, any>({
      query: (card) => ({
        url: `/v1/users/toFav/${card._id || card.id}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(card, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const userId = state.auth.user?._id;

        if (!userId) {
          return;
        }

        const patchResult = dispatch(
          userApi.util.updateQueryData("getUserById", userId, (draft) => {
            if (draft) {
              const cardId = card._id || card.id;
              const isFavourited = draft.favProperties.some((fav: any) => {
                const favId =
                  typeof fav === "string" ? fav : fav?._id || fav?.id;
                return favId === cardId;
              });

              if (isFavourited) {
                draft.favProperties = draft.favProperties.filter((fav: any) => {
                  const favId =
                    typeof fav === "string" ? fav : fav?._id || fav?.id;
                  return favId !== cardId;
                });
              } else {
                draft.favProperties.push(card);
              }
            }
          }),
        );

        try {
          const { data: updatedUser } = await queryFulfilled;
          dispatch(
            setUser({
              user: updatedUser as any,
              token: localStorage.getItem("token") || "",
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    // ✅ Get all favourite properties of a user
    getFavourites: builder.query<any[], void>({
      query: () => `/v1/users/favourites`,
      providesTags: ["User"],
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
} = userApi;
