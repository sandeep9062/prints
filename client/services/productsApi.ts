import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 🔐 Helper to get token (client only)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/products`;

// 🔐 Attach Authorization header
const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    // ✅ GET all products
    getProducts: builder.query<any, void>({
      query: () => ``,
      providesTags: ["Products"],
    }),

    // ✅ GET product by ID
    getProductById: builder.query<any, string>({
      query: (id) => `/${id}`,
      providesTags: ["Products"],
    }),

    // ✅ GET product by slug
    getProductBySlug: builder.query<any, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: ["Products"],
    }),

    // ✅ GET products by user
    getProductsByUser: builder.query<any, void>({
      query: () => `/user`,
      providesTags: ["Products"],
    }),

    // ✅ CREATE (supports JSON or FormData)
    addProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body, // can be JSON or FormData
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ UPDATE (supports JSON or FormData)
    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ DELETE
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ DELETE Product Image
    deleteProductImage: builder.mutation<
      any,
      { productId: string; imageUrl: string }
    >({
      query: ({ productId, imageUrl }) => ({
        url: `/${productId}/images`,
        method: "DELETE",
        body: { imageUrl },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

// 📌 Auto-generated hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductsByUserQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation,
} = productsApi;

// ============================================================
// SERVER-SIDE DATA FETCHING (for SSR/SSG pages)
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  badge?: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  dimensions: { length: number; width: number; height: number };
  options?: {
    sizes?: string[];
    paperTypes?: string[];
    colors?: string[];
  };
  minQuantity: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Fetch all products on the server (used in SSR).
 */
export async function fetchProductsServer(): Promise<ProductsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { products: [], total: 0, page: 1, pages: 1 };
    return res.json();
  } catch {
    return { products: [], total: 0, page: 1, pages: 1 };
  }
}

/**
 * Fetch a single product by slug on the server (used in SSR).
 */
export async function fetchProductBySlugServer(
  slug: string,
): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || data;
  } catch {
    return null;
  }
}
