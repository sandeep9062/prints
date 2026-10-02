import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/users`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export interface Address {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: string;
}

interface AddressPayload {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    // ✅ Get my addresses
    getMyAddresses: builder.query<
      { success: boolean; addresses: Address[] },
      void
    >({
      query: () => `/address`,
      providesTags: ["Address"],
    }),

    // ✅ Add address
    addAddress: builder.mutation<
      { success: boolean; address: Address },
      AddressPayload
    >({
      query: (body) => ({
        url: `/address`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address"],
    }),

    // ✅ Update address
    updateAddress: builder.mutation<
      { success: boolean; address: Address },
      { id: string; data: AddressPayload }
    >({
      query: ({ id, data }) => ({
        url: `/address/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    // ✅ Delete address
    deleteAddress: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetMyAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
