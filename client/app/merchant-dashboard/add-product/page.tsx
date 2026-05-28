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
  Plus,
  Sparkles,
  Ruler,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useAddProductMutation } from "@/services/productsApi";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ui/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/products";
import { motion } from "framer-motion";

const initialFormState = {
  name: "",
  slug: "",
  description: "",
  badge: "",
  price: 0,
  discountPrice: 0,
  images: [] as File[],
  category: "",
  stock: 50,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  options: {
    sizes: "",
    paperTypes: "",
    colors: "",
  },
};

export default function AddProductPage() {
  const [addProduct, { isLoading, isSuccess }] = useAddProductMutation();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (isSuccess) {
      setForm(initialFormState);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!form.slug && form.name) {
      const generatedSlug = form.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setForm((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length > 1) {
      const [parentKey, childKey] = keys;
      setForm((prev) => ({
        ...prev,
        [parentKey]: {
          // @ts-ignore
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (files: File[]) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleImageRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      sizes: form.options.sizes.split(",").map((s) => s.trim()),
      paperTypes: form.options.paperTypes.split(",").map((s) => s.trim()),
      colors: form.options.colors.split(",").map((s) => s.trim()),
    };

    const formData = new FormData();
    const productData = {
      ...form,
      options,
    };

    formData.append("productData", JSON.stringify(productData));
    form.images.forEach((imageFile) => {
      formData.append("image", imageFile);
    });

    try {
      await addProduct(formData).unwrap();
      toast({
        title: "Success!",
        description: "Product added successfully!",
      });
      router.push("/merchant-dashboard");
    } catch (err) {
      console.error("Failed to add product:", err);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const steps = [
    { number: 1, label: "Basic Info", icon: Package },
    { number: 2, label: "Pricing & Stock", icon: Package },
    { number: 3, label: "Details & Images", icon: Package },
  ];

  return (
    <div className="space-y-0">
      {/* Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/20 rounded-2xl p-2 border border-gray-100 dark:border-gray-700/30">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 w-full ${
                  currentStep === step.number
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
                    : currentStep > step.number
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    currentStep === step.number
                      ? "bg-white/20"
                      : currentStep > step.number
                        ? "bg-rose-100 dark:bg-rose-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.number}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs opacity-80">Step {step.number}</p>
                  <p className="text-sm font-medium">{step.label}</p>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mx-4 ${
                    currentStep > step.number
                      ? "bg-gradient-to-r from-rose-400 to-rose-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Product Information
          </CardTitle>
          <p className="text-white/80 text-sm">
            Fill in the details below to create your product listing
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Info */}
            <motion.div
              initial={false}
              animate={{
                opacity: currentStep === 1 ? 1 : 0.5,
                height: "auto",
              }}
              className={currentStep === 1 ? "block" : "hidden"}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-rose-300 dark:focus:border-rose-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="auto-generated"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-rose-300 dark:focus:border-rose-600"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product in detail..."
                    className="min-h-[120px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-rose-300 dark:focus:border-rose-600"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Pricing & Stock */}
            <motion.div
              initial={false}
              animate={{ opacity: currentStep === 2 ? 1 : 0.5 }}
              className={currentStep === 2 ? "block" : "hidden"}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pricing & Inventory
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="discountPrice"
                      className="text-sm font-medium"
                    >
                      Discount Price (₹)
                    </Label>
                    <Input
                      id="discountPrice"
                      name="discountPrice"
                      type="number"
                      value={form.discountPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-300 dark:focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Details & Images */}
            <motion.div
              initial={false}
              animate={{ opacity: currentStep === 3 ? 1 : 0.5 }}
              className={currentStep === 3 ? "block" : "hidden"}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Ruler className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Additional Details
                  </h3>
                </div>

                {/* Badge & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="badge" className="text-sm font-medium">
                      Badge
                    </Label>
                    <Input
                      id="badge"
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      placeholder="e.g., New, Sale, Featured"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
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
                      required
                    >
                      <option value="">Select a category</option>
                      {categories
                        .slice(1, 50)
                        .map((cat: any, index: number) => {
                          if (typeof cat === "string") {
                            return (
                              <option key={index} value={cat}>
                                {cat}
                              </option>
                            );
                          }
                          return (
                            <option
                              key={cat.id || index}
                              value={cat.slug || cat.name}
                            >
                              {cat.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Product Images</Label>
                  <ImageUploader
                    onUpload={handleImageUpload}
                    onRemove={handleImageRemove}
                  />
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

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-4">
                    <Link href="/merchant-dashboard" passHref>
                      <Button
                        type="button"
                        variant="outline"
                        className="px-8 border-gray-300 dark:border-gray-600"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Publish Product
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
