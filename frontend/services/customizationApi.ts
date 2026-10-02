import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/customize`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const customizationApi = createApi({
  reducerPath: "customizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Customizations"],
  endpoints: (builder) => ({
    // ✅ POST a new customization
    createCustomization: builder.mutation<
      { success: boolean; message: string; data: any },
      {
        groomName: string;
        brideName: string;
        eventDate: string;
        venue: string;
        message: string;
        selectedFont: string;
        selectedColor: { name: string; primary: string; secondary: string };
        selectedBorder: { name: string; pattern: string };
        selectedTemplate: {
          name: string;
          preview: string;
          ornaments: string[];
        };
        uploadedImages: string[];
      }
    >({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customizations"],
    }),

    // ✅ Upload images to Cloudinary via backend
    uploadCustomizationImages: builder.mutation<
      { success: boolean; message: string; data: string[] },
      FormData
    >({
      query: (formData) => ({
        url: `/upload`,
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ GET all customizations (admin)
    getCustomizations: builder.query<any, void>({
      query: () => ``,
      providesTags: ["Customizations"],
    }),

    // ✅ GET current user's customizations
    getMyCustomizations: builder.query<any, void>({
      query: () => `/my`,
      providesTags: ["Customizations"],
    }),

    // ✅ GET single customization by ID
    getCustomizationById: builder.query<any, string>({
      query: (id) => `/${id}`,
      providesTags: ["Customizations"],
    }),

    // ✅ DELETE customization (owner or admin)
    deleteCustomization: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customizations"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useCreateCustomizationMutation,
  useUploadCustomizationImagesMutation,
  useGetCustomizationsQuery,
  useGetMyCustomizationsQuery,
  useGetCustomizationByIdQuery,
  useDeleteCustomizationMutation,
} = customizationApi;
