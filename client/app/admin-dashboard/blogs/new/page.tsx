"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useCreateBlogMutation } from "@/services/blogApi";
import { X } from "lucide-react";
import RichTextEditor, { RichTextEditorRef } from "@/components/RichTextEditor";

export default function NewBlogPage() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorRef>(null);

  const [createBlog, { isLoading: loading }] = useCreateBlogMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync content from the RichTextEditor ref
    const editorContent = editorRef.current?.getCurrentContent() || "";

    if (!formData.title || !editorContent) {
      toast({ variant: "destructive", title: "Please fill required fields" });
      return;
    }

    try {
      await createBlog({
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        content: editorContent,
        tags: formData.tags,
        image:
          typeof formData.coverImage === "string" ? formData.coverImage : "",
      }).unwrap();

      toast({ title: "Blog published successfully! 🚀" });
      router.push("/admin-dashboard/blogs");
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast({
        variant: "destructive",
        title: "Error creating blog",
        description: "Please check your network or try again.",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin-dashboard/blogs"
          className="flex items-center gap-2 text-slate-600 hover:text-[#4161df] transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back to Blogs</span>
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Create New Blog</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Blog Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. How to Choose the Right Property"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4161df]/20 outline-none transition-all"
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
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Slug (URL-friendly)
              </label>
              <input
                type="text"
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4161df]/20 outline-none transition-all"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type tags separated by comma, then press Add"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4161df]/20 outline-none transition-all"
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
                  className="px-4 py-2 bg-[#4161df] text-white rounded-lg text-sm hover:bg-[#3551c0] transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Excerpt (Meta Description)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe what this blog is about for SEO..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#4161df]/20 outline-none resize-none transition-all"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Content
              </label>
              <RichTextEditor
                ref={editorRef}
                content={formData.content}
                isMarkdown={true}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#4161df] transition-colors cursor-pointer"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                <option value="Investment">Investment Guide</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Market News">Market News</option>
                <option value="Legal">Legal & Documentation</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Home Buying">Home Buying Guide</option>
                <option value="Rental">Rental Guide</option>
                <option value="Construction">Construction & Development</option>
                <option value="Interior Design">Interior & Design</option>
                <option value="Finance">Property Tax & Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Cover Image
              </label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-slate-300 hover:border-[#4161df] hover:bg-[#4161df]/5 cursor-pointer transition-all text-sm text-slate-600"
                  >
                    <ImageIcon size={20} />
                    <span>
                      {formData.coverImage instanceof File
                        ? formData.coverImage.name
                        : "Choose Image"}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">
                      Or use URL
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none text-sm"
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

            <hr className="border-slate-100" />

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#4161df] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#3551c0] disabled:opacity-50 transition-all shadow-lg shadow-[#4161df]/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
