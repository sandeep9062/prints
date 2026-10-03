"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loader2, Package } from "lucide-react";
import ProductForm from "@/components/admin-dashbaord/ProductForm";
import { useGetProductByIdQuery } from "@/services/productsApi";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: productData, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !productData?.product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Package className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground font-medium">Failed to load product</p>
          <p className="text-muted-foreground text-sm">
            The product may not exist or there was a connection error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductForm mode="edit" initialData={productData.product} productId={id} />
  );
}
