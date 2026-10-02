import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🔐 Helper to get token (client only)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/website-images`;

// 🔐 Attach Authorization header
const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    // ✅ GET all images
    getMedia: builder.query<any, void>({
      query: () => ``,
      providesTags: ["Media"],
    }),

    // ✅ UPLOAD image (FormData)
    uploadMedia: builder.mutation<any, FormData>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Media"],
    }),

    // ✅ UPDATE image details
    updateMedia: builder.mutation<
      any,
      { id: string; body: FormData | Record<string, any> }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Media"],
    }),

    // ✅ DELETE image
    deleteMedia: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
  }),
});

// 📌 Auto-generated hooks
export const {
  useGetMediaQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
