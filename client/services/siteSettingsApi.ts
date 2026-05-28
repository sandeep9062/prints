import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/site-settings`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export interface SiteSettings {
  _id?: string;
  websiteName: string;
  websiteUrl?: string;
  email: string;
  mainOffice: string;
  branchOffice: string;
  googleMapUrl?: string;
  contactNo1: string;
  contactNo2?: string;
  whatsAppNo: string;
  GSTNO?: string;
  accountName?: string;
  accountNumber?: string;
  IFSCcode?: string;
  branch?: string;
  logoUrl?: string;
  bannerUrl?: string;
  favicon?: string;
  language?: string;
  country?: string;
  linkedin?: string;
  pinterest?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtubeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const siteSettingsApi = createApi({
  reducerPath: "siteSettingsApi",
  baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders }),
  tagTypes: ["SiteSettings"],
  endpoints: (builder) => ({
    // ✅ GET single settings document
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => ``,
      providesTags: ["SiteSettings"],
      transformResponse: (response: any) => {
        // API returns just the object or {} if none
        return response?._id ? response : ({} as SiteSettings);
      },
    }),

    // ✅ CREATE initial settings
    createSiteSettings: builder.mutation<SiteSettings, Partial<SiteSettings>>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SiteSettings"],
    }),

    // ✅ UPDATE settings
    updateSiteSettings: builder.mutation<
      SiteSettings,
      { id: string; body: FormData | Partial<SiteSettings> }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SiteSettings"],
    }),
  }),
});

export const {
  useGetSiteSettingsQuery,
  useCreateSiteSettingsMutation,
  useUpdateSiteSettingsMutation,
} = siteSettingsApi;
