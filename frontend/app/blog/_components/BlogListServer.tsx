import { fetchBlogsServer } from "@/services/blogApi";
import BlogListClient from "./BlogListClient";

export async function BlogListServer() {
  const initialPosts = await fetchBlogsServer();

  return <BlogListClient initialPosts={initialPosts} />;
}
