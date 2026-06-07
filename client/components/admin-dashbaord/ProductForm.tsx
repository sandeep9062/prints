"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, UploadCloud, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/services/productsApi";

interface ProductFormData {
  name: string;
  description: string;
  badge: string;
  price: string;
  discountPrice: string;
  category: string;
  stock: string;
  featured: boolean;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: any;
  productId?: string;
}

export default function ProductForm({
  mode,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    badge: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    featured: false,
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Populate form with initial data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        badge: initialData.badge || "",
        price: initialData.price?.toString() || "",
        discountPrice: initialData.discountPrice?.toString() || "",
        category: initialData.category || "",
        stock: initialData.stock?.toString() || "",
        featured: initialData.featured || false,
      });
      if (initialData.images && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
      }
    }
  }, [mode, initialData]);

  const handleFormChange = (
    field: keyof ProductFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = useCallback((files: File[]) => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setNewImages((prev) => [...prev, ...files]);
  }, []);

  const handleImageRemove = useCallback(
    (index: number) => {
      // If removing an existing image (from edit mode)
      if (index < imagePreviews.length - newImages.length) {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      } else {
        // Removing a newly added image
        const newImageIndex = index - (imagePreviews.length - newImages.length);
        setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
        setImagePreviews((prev) => {
          URL.revokeObjectURL(prev[index]);
          return prev.filter((_, i) => i !== index);
        });
      }
    },
    [imagePreviews, newImages],
  );

  const handleRemoveExistingImage = useCallback((index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    try {
      const productData = JSON.stringify({
        name: formData.name,
        description: formData.description,
        badge: formData.badge,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : undefined,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured,
        // For edit mode, keep existing images that weren't removed
        ...(mode === "edit"
          ? { images: imagePreviews.filter((img) => !img.startsWith("blob:")) }
          : {}),
      });

      const body = new FormData();
      body.append("productData", productData);

      // Append new images
      newImages.forEach((file) => {
        body.append("image", file);
      });

      if (mode === "add") {
        await addProduct(body).unwrap();
        toast({
          title: "Product Created",
          description: `"${formData.name}" has been created successfully.`,
        });
      } else {
        await updateProduct({ id: productId!, body }).unwrap();
        toast({
          title: "Product Updated",
          description: `"${formData.name}" has been updated successfully.`,
        });
      }

      router.push("/admin-dashboard/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message ||
          `Failed to ${mode === "add" ? "create" : "update"} product. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const isSubmitting = isAdding || isUpdating;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin-dashboard/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-gray-500 mt-1">
              {mode === "add"
                ? "Fill in the details to create a new product"
                : `Editing "${initialData?.name || ""}"`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => router.push("/admin-dashboard/products")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.price}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "add" ? "Creating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "add" ? "Create Product" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    placeholder="e.g. Printing, Design, Signage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    value={formData.badge}
                    onChange={(e) => handleFormChange("badge", e.target.value)}
                    placeholder="e.g. New, Sale, Popular"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(Array.from(e.target.files));
                      e.target.value = "";
                    }
                  }}
                />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">
                  Click to select images or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, JPEG up to 60MB each
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      handleFormChange("discountPrice", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Product</Label>
                  <p className="text-sm text-gray-500">
                    Show this product on the homepage
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleFormChange("featured", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
