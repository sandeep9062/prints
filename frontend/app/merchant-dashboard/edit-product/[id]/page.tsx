"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  Save,
  X,
  Sparkles,
  Ruler,
  Palette,
} from "lucide-react";
import Link from "next/link";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductImageMutation,
} from "@/services/productsApi";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/ui/ImageUploader";
import { useToast } from "@/hooks/use-toast";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    data: product,
    isLoading: isFetching,
    isError,
  } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    badge: "",
    price: 0,
    discountPrice: 0,
    images: [] as string[],
    category: "",
    stock: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    options: { sizes: "", paperTypes: "", colors: "" },
  });

  useEffect(() => {
    if (product && product.product) {
      const {
        name,
        slug,
        description,
        badge,
        price,
        discountPrice,
        images,
        category,
        stock,
        dimensions,
        options,
      } = product.product;

      setForm({
        name: name || "",
        slug: slug || "",
        description: description || "",
        badge: badge || "",
        price: price || 0,
        discountPrice: discountPrice || 0,
        images: images || [],
        category: category || "",
        stock: stock || 0,
        dimensions: {
          length: dimensions?.length || 0,
          width: dimensions?.width || 0,
          height: dimensions?.height || 0,
        },
        options: {
          sizes: options?.sizes?.join(", ") || "",
          paperTypes: options?.paperTypes?.join(", ") || "",
          colors: options?.colors?.join(", ") || "",
        },
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      const [parentKey, childKey] = keys;
      if (parentKey === "dimensions" || parentKey === "options") {
        setForm((prev) => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: value,
          },
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (files: File[]) => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  const handleImageRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingImage = async (imageUrl: string) => {
    try {
      await deleteProductImage({ productId: id, imageUrl }).unwrap();
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((url) => url !== imageUrl),
      }));
      toast({
        title: "Success",
        description: "Image removed successfully!",
      });
    } catch (err) {
      console.error("Failed to delete image:", err);
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const productData = {
      ...form,
      options: {
        sizes: form.options.sizes.split(",").map((s) => s.trim()),
        paperTypes: form.options.paperTypes.split(",").map((s) => s.trim()),
        colors: form.options.colors.split(",").map((s) => s.trim()),
      },
    };

    formData.append("productData", JSON.stringify(productData));

    try {
      await updateProduct({ id, body: formData }).unwrap();
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      router.push("/merchant-dashboard");
    } catch (err) {
      console.error("Failed to update product:", err);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-68px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-68px)]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            Failed to load product.
          </p>
          <Link href="/merchant-dashboard">
            <Button variant="outline" className="mt-4">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Edit Product Details
          </CardTitle>
          <p className="text-white/80 text-sm">
            Update your product information below
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="min-h-[120px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pricing & Stock
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    value={form.discountPrice}
                    onChange={handleChange}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Ruler className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Details & Options
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    placeholder="e.g., New, Sale"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 transition-all"
                  >
                    <option value="">Select a category</option>
                    <option value="visiting-card">Visiting Card</option>
                    <option value="invitation-card">Invitation Card</option>
                    <option value="wedding-card">Wedding Card</option>
                    <option value="poster">Poster</option>
                    <option value="flyer">Flyer</option>
                    <option value="brochure">Brochure</option>
                  </select>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <Label>Product Images</Label>
                <ImageUploader
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  {form.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
                <legend className="text-sm font-semibold px-3 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-500" />
                  Dimensions (cm)
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <Input
                      id="length"
                      name="dimensions.length"
                      type="number"
                      value={form.dimensions.length}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      name="dimensions.width"
                      type="number"
                      value={form.dimensions.width}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      name="dimensions.height"
                      type="number"
                      value={form.dimensions.height}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Options */}
              <fieldset className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
                <legend className="text-sm font-semibold px-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  Product Options
                </legend>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                    <Input
                      id="sizes"
                      name="options.sizes"
                      value={form.options.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paperTypes">
                      Paper Types (comma-separated)
                    </Label>
                    <Input
                      id="paperTypes"
                      name="options.paperTypes"
                      value={form.options.paperTypes}
                      onChange={handleChange}
                      placeholder="Glossy, Matte, Premium"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input
                      id="colors"
                      name="options.colors"
                      value={form.options.colors}
                      onChange={handleChange}
                      placeholder="Red, Blue, Black"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex-1 text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
              <Link href="/merchant-dashboard" passHref>
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 py-3 text-lg border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
