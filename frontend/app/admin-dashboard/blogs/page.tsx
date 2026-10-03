"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useGetBlogsQuery, useDeleteBlogMutation } from "@/services/blogApi";

export default function BlogsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-muted min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Link
          href="/admin-dashboard/blogs/new"
          className="flex items-center justify-center gap-2 bg-brand text-primary-foreground px-4 py-2 rounded-lg hover:bg-brand-hover transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add New Blog
        </Link>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <input
            type="text"
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blogs Table/List */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex justify-center items-center">
            <Loader2 className="animate-spin text-brand" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...filteredBlogs]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                            <Image
                              src={blog.image || "/placeholder.svg"}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate max-w-[200px] md:max-w-xs">
                              {blog.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate italic">
                              /{blog.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-foreground w-fit">
                            {blog.category || "Uncategorized"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin-dashboard/blogs/${blog.slug}`}
                            className="p-2 text-muted-foreground hover:text-brand transition-colors"
                            title="View Live"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <Link
                            href={`/admin-dashboard/blogs/edit/${blog._id}`}
                            className="p-2 text-muted-foreground hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 text-muted-foreground hover:text-brand transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredBlogs.length === 0 && (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
          <FileText className="mx-auto size-12 text-muted-foreground/70 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No blogs found</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first blog post.
          </p>
          <Link
            href="/admin-dashboard/blogs/new"
            className="bg-brand text-primary-foreground px-6 py-2 rounded-lg hover:bg-brand-hover"
          >
            Create Blog
          </Link>
        </div>
      )}
    </div>
  );
}
