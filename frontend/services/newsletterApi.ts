import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/newsletter`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeResponse {
  message: string;
  alreadySubscribed: boolean;
}

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Newsletter"],
  endpoints: (builder) => ({
    // ✅ SUBSCRIBE an email (public)
    subscribeNewsletter: builder.mutation<SubscribeResponse, { email: string }>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // ✅ GET all subscribers (admin)
    getSubscribers: builder.query<NewsletterSubscriber[], void>({
      query: () => ``,
      providesTags: ["Newsletter"],
    }),
  }),
});

// ✅ Export hooks
export const { useSubscribeNewsletterMutation, useGetSubscribersQuery } =
  newsletterApi;