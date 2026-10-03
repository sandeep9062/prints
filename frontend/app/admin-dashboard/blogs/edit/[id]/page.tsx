"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "@/services/blogApi";
import RichTextEditor, { RichTextEditorRef } from "@/components/RichTextEditor";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const editorRef = useRef<RichTextEditorRef>(null);
  const contentInitializedRef = useRef(false);

  const { data: blog, isLoading: fetching, isError } = useGetBlogByIdQuery(id);

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    tags: string[];
    coverImage: string | File;
  }>({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    tags: [],
    coverImage: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addTags = () => {
    const newTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (newTags.length > 0) {
      setFormData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...newTags])],
      }));
    }
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Sync fetched data with local form state and push into the editor
  useEffect(() => {
    if (blog && !contentInitializedRef.current) {
      const content = blog.content || "";
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        category: blog.category || "",
        excerpt: blog.excerpt || content.substring(0, 150) || "",
        content,
        tags: blog.tags || [],
        coverImage: blog.image || "",
      });
      setImagePreview(blog.image || null);

      // Populate the RichTextEditor with existing content
      if (editorRef.current && content) {
        editorRef.current.setContent(content);
      }
      contentInitializedRef.current = true;
    }
  }, [blog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync content from the RichTextEditor ref
    const editorContent = editorRef.current?.getCurrentContent() || "";

    if (!editorContent) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const updatePayload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        content: editorContent,
        tags: formData.tags,
        image:
          typeof formData.coverImage === "string" ? formData.coverImage : "",
      };

      await updateBlog({
        id,
        update: updatePayload,
      }).unwrap();

      toast.success("Blog updated successfully! ✅");
      router.push("/admin-dashboard/blogs");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed", {
        description: "Something went wrong while saving.",
      });
    }
  };

  if (fetching)
    return (
      <div className="h-[70vh] flex flex-col gap-4 items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={50} />
        <p className="text-muted-foreground font-medium">Fetching Blog Details...</p>
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading blog. Please try again.</p>
        <Link
          href="/admin-dashboard/blogs"
          className="text-brand underline"
        >
          Go Back
        </Link>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-muted min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin-dashboard/blogs"
          className="flex items-center gap-2 text-muted-foreground hover:text-brand transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to List</span>
        </Link>
        <h1 className="font-sans text-xl font-semibold text-foreground">
          Edit Blog: {blog?.title}
        </h1>
      </div>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Blog Title
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  const autoSlug = newTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    title: newTitle,
                    slug: prev.slug === "" ? autoSlug : prev.slug,
                  }));
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Blog Slug (URL-friendly)
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type tags separated by comma, then press Add"
                  className="flex-1 px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTags();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTags}
                  className="px-4 py-2 bg-brand text-primary-foreground rounded-lg text-sm hover:bg-brand-hover transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-brand-soft text-brand rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Excerpt (Meta Description)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe what this blog is about for SEO..."
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-brand/20 outline-none resize-none transition-all"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Blog Content
              </label>
              <RichTextEditor
                ref={editorRef}
                content={formData.content}
                isMarkdown={true}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Category
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                <option value="Wedding Cards">Wedding Cards</option>
                <option value="Invitation Cards">Invitation Cards</option>
                <option value="Visiting Cards">Visiting Cards</option>
                <option value="Shagun Envelopes">Shagun Envelopes</option>
                <option value="Brochures & Catalogs">Brochures & Catalogs</option>
                <option value="Paper & Finishes">Paper & Finishes</option>
                <option value="Printing Guide">Printing Guide</option>
                <option value="Design Inspiration">Design Inspiration</option>
                <option value="Business Stationery">Business Stationery</option>
                <option value="Festive Collection">Festive Collection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Cover Image
              </label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="coverImage"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="coverImage"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-brand hover:bg-brand/5 cursor-pointer transition-all text-sm text-muted-foreground"
                  >
                    <ImageIcon size={20} />
                    <span>
                      {formData.coverImage instanceof File
                        ? formData.coverImage.name
                        : "Change Image"}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or use URL
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs outline-none"
                  value={
                    typeof formData.coverImage === "string"
                      ? formData.coverImage
                      : ""
                  }
                  onChange={(e) => {
                    setFormData({ ...formData, coverImage: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                />
              </div>
            </div>

            <hr className="border-border" />

            <button
              disabled={isUpdating}
              type="submit"
              className="w-full bg-brand text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-hover disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {isUpdating ? "Saving Changes..." : "Save Blog"}
            </button>

            <p className="text-[10px] text-center text-muted-foreground font-medium">
              ID: {id}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
