import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/blogs`;

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    // Fetch all blog posts
    getBlogs: builder.query<BlogPost[], void>({
      query: () => "",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Blog" as const, id: _id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    // Fetch single blog post by ID
    getBlogById: builder.query<BlogPost, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Fetch single blog post by slug
    getBlogBySlug: builder.query<BlogPost, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    // Create new blog post
    createBlog: builder.mutation<BlogPost, FormData | Partial<BlogPost>>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
        ...(body instanceof FormData
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    // Update blog post
    updateBlog: builder.mutation<
      BlogPost,
      { id: string; update: FormData | Partial<BlogPost> }
    >({
      query: ({ id, update }) => ({
        url: `/${id}`,
        method: "PUT",
        body: update,
        ...(update instanceof FormData
          ? {}
          : { headers: { "Content-Type": "application/json" } }),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    // Delete blog post
    deleteBlog: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

// ============================================================
// SERVER-SIDE DATA FETCHING (for SSR/SSG pages)
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";

/**
 * Fetch all blog posts on the server (used in SSR).
 */
export async function fetchBlogsServer(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/blogs`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch a single blog post by slug on the server (used in SSR).
 */
export async function fetchBlogBySlugServer(
  slug: string,
): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/blogs/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}
