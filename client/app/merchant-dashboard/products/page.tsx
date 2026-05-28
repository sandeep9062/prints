"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Grid3X3,
  LayoutGrid,
  ShoppingBag,
  Search,
  PlusCircle,
  Edit,
  Trash,
  Package,
  Eye,
  Box,
  Tag,
  AlertTriangle,
  TrendingUp,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useGetProductsByUserQuery,
  useDeleteProductMutation,
} from "@/services/productsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { categories as allCategories } from "@/data/products";

const categories = [
  "All",
  ...allCategories.filter((c) => c !== "All Products"),
];

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  badge?: string;
  stock?: number;
}

const ProductCardSkeleton = () => (
  <div className="group overflow-hidden animate-pulse rounded-xl bg-white dark:bg-gray-800/40 shadow-sm">
    <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, error, isLoading } = useGetProductsByUserQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const { toast } = useToast();
  const products: Product[] = data?.products || [];
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const categoryParam = searchParams.get("category") || "All";

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (categoryParam !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase().replace(" ", "-") === categoryParam ||
          p.category === categoryParam,
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [products, categoryParam, searchQuery]);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.discountPrice || p.price) * (p.stock || 0),
    0,
  );
  const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete._id).unwrap();
        toast({
          title: "Product Deleted",
          description: `"${productToDelete.name}" has been deleted.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      } finally {
        setProductToDelete(null);
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{totalProducts}</div>
              <p className="text-xs text-emerald-200 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> In catalog
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Inventory Value
              </CardTitle>
              <Tag className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                ₹{totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-blue-200">Total stock value</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Stock
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{totalStock}</div>
              <p className="text-xs text-purple-200">Total units in stock</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card
            className={`relative overflow-hidden text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group ${outOfStock > 0 ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-green-500 to-green-600"}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{outOfStock}</div>
              <p className="text-xs text-amber-200">
                {outOfStock > 0 ? "Needs attention" : "All in stock"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/50 dark:bg-gray-800/20 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                categoryParam === category ||
                  (category === "All" && !categoryParam)
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 border border-gray-200 dark:border-gray-700",
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg transition-all",
                viewMode === "grid" &&
                  "bg-emerald-500 text-white hover:bg-emerald-600",
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "large" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("large")}
              className={cn(
                "rounded-lg transition-all",
                viewMode === "large" &&
                  "bg-emerald-500 text-white hover:bg-emerald-600",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 border-2">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium">
              Failed to load products.
            </p>
            <p className="text-red-500/70 text-sm mt-1">
              Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : filteredProducts.length > 0 ? (
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {filteredProducts.map((product: Product, index: number) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="group relative rounded-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden bg-white dark:bg-gray-800/40 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div
                  className={cn(
                    "relative overflow-hidden",
                    viewMode === "large" ? "aspect-[4/5]" : "aspect-square",
                  )}
                >
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      {product.badge}
                    </span>
                  )}
                  {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      Low Stock
                    </span>
                  )}
                  {(product.stock || 0) === 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      Out of Stock
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Link href={`/products/${product._id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white/90 hover:bg-white shadow-lg border-0 backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={`/merchant-dashboard/edit-product/${product._id}`}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-white/90 hover:bg-white shadow-lg border-0 backdrop-blur-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 bg-white/90 hover:bg-red-50 shadow-lg border-0 text-red-600 backdrop-blur-sm"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.stock || 0} in stock
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                        ₹
                        {(
                          product.discountPrice || product.price
                        ).toLocaleString()}
                      </span>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        (product.stock || 0) > 10
                          ? "border-green-200 text-green-600"
                          : (product.stock || 0) > 0
                            ? "border-amber-200 text-amber-600"
                            : "border-red-200 text-red-600",
                      )}
                    >
                      {product.stock || 0} in stock
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="mx-auto h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? "No products found" : "No products yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search."
              : "Get started by adding your first product."}
          </p>
          {!searchQuery && (
            <Link href="/merchant-dashboard/add-product">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      )}

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Delete &ldquo;
              {productToDelete?.name}&rdquo;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/40 p-6 h-28"
              />
            ))}
          </div>
          <div className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/40 h-16" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
