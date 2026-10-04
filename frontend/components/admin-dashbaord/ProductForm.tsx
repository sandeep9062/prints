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
import { toast } from "sonner";
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
  /** Product.js → dimensions.length (Number, default 0) */
  dimensionLength: string;
  /** Product.js → dimensions.width (Number, default 0) */
  dimensionWidth: string;
  /** Product.js → dimensions.height (Number, default 0) */
  dimensionHeight: string;
  /** Product.js → options.sizes ([String]) — comma separated */
  sizes: string;
  /** Product.js → options.paperTypes ([String]) — comma separated */
  paperTypes: string;
  /** Product.js → options.colors ([String]) — comma separated */
  colors: string;
}

/** Mirrors the `stock` default on the Mongoose schema. */
const DEFAULT_STOCK = 50;

/**
 * Blank input → `undefined` so the Mongoose default applies instead of
 * overwriting it with a meaningless 0.
 */
const toNumberOrUndefined = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** "A, B , C" → ["A", "B", "C"] for the model's `[String]` option arrays. */
const toStringArray = (value: string): string[] =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

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
    dimensionLength: "",
    dimensionWidth: "",
    dimensionHeight: "",
    sizes: "",
    paperTypes: "",
    colors: "",
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
        // `dimensions` is optional on the schema — guard before reading.
        dimensionLength: initialData.dimensions?.length?.toString() || "",
        dimensionWidth: initialData.dimensions?.width?.toString() || "",
        dimensionHeight: initialData.dimensions?.height?.toString() || "",
        sizes: initialData.options?.sizes?.join(", ") || "",
        paperTypes: initialData.options?.paperTypes?.join(", ") || "",
        colors: initialData.options?.colors?.join(", ") || "",
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
    // Mirror the schema's `required` flags so the user gets an inline error
    // instead of a server-side 500 / silent bad data.
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }

    const price = toNumberOrUndefined(formData.price);
    if (price === undefined || price <= 0) {
      toast.error("Price is required and must be greater than 0");
      return;
    }

    const discountPrice = toNumberOrUndefined(formData.discountPrice);
    if (discountPrice !== undefined && discountPrice >= price) {
      toast.error("Discount price must be lower than the price");
      return;
    }

    // createProduct rejects the upload outright when no file arrives.
    if (mode === "add" && newImages.length === 0) {
      toast.error("Add at least one product image");
      return;
    }

    try {
      // Only include dimensions when at least one side was filled in —
      // otherwise let the schema defaults apply.
      const length = toNumberOrUndefined(formData.dimensionLength);
      const width = toNumberOrUndefined(formData.dimensionWidth);
      const height = toNumberOrUndefined(formData.dimensionHeight);
      const hasDimensions =
        length !== undefined || width !== undefined || height !== undefined;

      const productData = JSON.stringify({
        name: formData.name.trim(),
        description: formData.description,
        badge: formData.badge,
        price,
        discountPrice,
        category: formData.category.trim(),
        stock: toNumberOrUndefined(formData.stock) ?? DEFAULT_STOCK,
        featured: formData.featured,
        ...(hasDimensions
          ? { dimensions: { length, width, height } }
          : {}),
        options: {
          sizes: toStringArray(formData.sizes),
          paperTypes: toStringArray(formData.paperTypes),
          colors: toStringArray(formData.colors),
        },
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
        toast.success("Product Created", {
          description: `"${formData.name}" has been created successfully.`,
        });
      } else {
        await updateProduct({ id: productId!, body }).unwrap();
        toast.success("Product Updated", {
          description: `"${formData.name}" has been updated successfully.`,
        });
      }

      router.push("/admin-dashboard/products");
    } catch (error: any) {
      toast.error("Error", {
        description:
          error?.data?.message ||
          `Failed to ${mode === "add" ? "create" : "update"} product. Please try again.`,
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
            <h1 className="font-sans text-2xl lg:text-3xl font-semibold text-foreground">
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground mt-1">
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
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.category.trim() ||
              !toNumberOrUndefined(formData.price)
            }
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
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-brand"
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
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Click to select images or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
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
                        className="absolute top-1 right-1 bg-destructive text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
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
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  placeholder={`${DEFAULT_STOCK}`}
                />
                <p className="text-xs text-muted-foreground">
                  Defaults to {DEFAULT_STOCK} when left blank
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Product</Label>
                  <p className="text-sm text-muted-foreground">
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
        {/* Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>Dimensions (cm)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dimensionLength">Length</Label>
                  <Input
                    id="dimensionLength"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.dimensionLength}
                    onChange={(e) =>
                      handleFormChange("dimensionLength", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensionWidth">Width</Label>
                  <Input
                    id="dimensionWidth"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.dimensionWidth}
                    onChange={(e) =>
                      handleFormChange("dimensionWidth", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensionHeight">Height</Label>
                  <Input
                    id="dimensionHeight"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.dimensionHeight}
                    onChange={(e) =>
                      handleFormChange("dimensionHeight", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sizes">Sizes</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) => handleFormChange("sizes", e.target.value)}
                  placeholder="e.g. 5x7, 6x9"
                />
                <p className="text-xs text-muted-foreground">
                  Comma separated
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperTypes">Paper Types</Label>
                <Input
                  id="paperTypes"
                  value={formData.paperTypes}
                  onChange={(e) =>
                    handleFormChange("paperTypes", e.target.value)
                  }
                  placeholder="e.g. Matte, Gloss"
                />
                <p className="text-xs text-muted-foreground">
                  Comma separated
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Colors</Label>
                <Input
                  id="colors"
                  value={formData.colors}
                  onChange={(e) => handleFormChange("colors", e.target.value)}
                  placeholder="e.g. Gold, Silver"
                />
                <p className="text-xs text-muted-foreground">
                  Comma separated
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
