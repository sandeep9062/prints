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
import { toast } from "sonner";
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
  <div className="group overflow-hidden animate-pulse rounded-xl bg-card dark:bg-card/40 shadow-sm">
    <div className="aspect-square w-full bg-muted dark:bg-card rounded-t-xl"></div>
    <div className="p-5 space-y-3">
      <div className="h-4 bg-muted dark:bg-card rounded w-3/4"></div>
      <div className="h-6 bg-muted dark:bg-card rounded w-2/3"></div>
      <div className="h-4 bg-muted dark:bg-card rounded w-full"></div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-8 bg-muted dark:bg-card rounded w-1/4"></div>
        <div className="h-8 bg-muted dark:bg-card rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, error, isLoading } = useGetProductsByUserQuery();
  const [deleteProduct] = useDeleteProductMutation();
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
        toast.success("Product Deleted", {
          description: `"${productToDelete.name}" has been deleted.`,
        });
      } catch (error) {
        toast.error("Error", {
          description: "Failed to delete product.",
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{totalProducts}</div>
              <p className="text-xs text-brand flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> In catalog
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Inventory Value
              </CardTitle>
              <Tag className="h-5 w-5 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                ₹{totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-foreground">Total stock value</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Total Stock
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{totalStock}</div>
              <p className="text-xs text-brand">Total units in stock</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card
            className={`relative overflow-hidden text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group ${outOfStock > 0 ? "bg-gradient-to-br from-brand to-brand-hover" : "bg-gradient-to-br from-brand to-brand-hover"}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{outOfStock}</div>
              <p className="text-xs text-gold-text">
                {outOfStock > 0 ? "Needs attention" : "All in stock"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card/50 dark:bg-card/20 rounded-xl p-4 border border-border dark:border-border/30">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                categoryParam === category ||
                  (category === "All" && !categoryParam)
                  ? "bg-gradient-to-r from-brand to-brand-hover text-primary-foreground shadow-lg scale-105"
                  : "bg-card dark:bg-card text-muted-foreground dark:text-muted-foreground hover:bg-success/10 dark:hover:bg-success/20/20 hover:text-success border border-border dark:border-border",
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border bg-card dark:bg-card text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-success dark:focus:ring-success transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-card dark:bg-card rounded-xl border border-border dark:border-border p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg transition-all",
                viewMode === "grid" &&
                  "bg-success text-primary-foreground hover:bg-success",
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
                  "bg-success text-primary-foreground hover:bg-success",
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
        <Card className="border-destructive/40 bg-destructive/10 dark:bg-destructive/10 border-2">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive dark:text-destructive font-medium">
              Failed to load products.
            </p>
            <p className="text-destructive/70 text-sm mt-1">
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
              <div className="group relative rounded-xl border border-border dark:border-border/30 overflow-hidden bg-card dark:bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
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
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      {product.badge}
                    </span>
                  )}
                  {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      Low Stock
                    </span>
                  )}
                  {(product.stock || 0) === 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      Out of Stock
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Link href={`/products/${product._id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-card/90 hover:bg-card shadow-lg border-0 backdrop-blur-sm"
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
                        className="h-9 w-9 bg-card/90 hover:bg-card shadow-lg border-0 backdrop-blur-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 bg-card/90 hover:bg-destructive/10 shadow-lg border-0 text-destructive backdrop-blur-sm"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground uppercase tracking-wider font-medium">
                      {product.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.stock || 0} in stock
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-foreground dark:text-primary-foreground mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg bg-gradient-to-r from-brand to-brand-hover dark:from-brand dark:to-brand-hover bg-clip-text text-transparent">
                        ₹
                        {(
                          product.discountPrice || product.price
                        ).toLocaleString()}
                      </span>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        (product.stock || 0) > 10
                          ? "border-success/40 text-success"
                          : (product.stock || 0) > 0
                            ? "border-gold/50 text-gold-text dark:border-gold/40 dark:text-gold"
                            : "border-destructive/40 text-destructive",
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
        <div className="text-center py-16 bg-card/50 dark:bg-card/20 rounded-xl border border-dashed border-border dark:border-border">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-soft to-card dark:from-brand/20 dark:to-brand-hover/20 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="mx-auto h-8 w-8 text-brand" />
          </div>
          <h3 className="text-xl font-semibold text-foreground dark:text-primary-foreground mb-2">
            {searchQuery ? "No products found" : "No products yet"}
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search."
              : "Get started by adding your first product."}
          </p>
          {!searchQuery && (
            <Link href="/merchant-dashboard/add-product">
              <Button className="bg-gradient-to-r from-brand to-brand-hover hover:from-brand hover:to-brand-hover text-primary-foreground shadow-lg">
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
              <AlertTriangle className="h-5 w-5 text-destructive" />
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
              className="rounded-xl bg-primary hover:bg-brand-hover"
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
                className="animate-pulse rounded-xl bg-muted dark:bg-card/40 p-6 h-28"
              />
            ))}
          </div>
          <div className="animate-pulse rounded-xl bg-muted dark:bg-card/40 h-16" />
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
