"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Edit,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/services/productsApi";

const getProductStatusColor = (stock: number) => {
  return stock > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
};

const getProductStatus = (stock: number) => {
  return stock > 0 ? "Active" : "Out of Stock";
};

const AdminProducts = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  // RTK Query hooks
  const { data: productsData, isLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const allProducts = useMemo(() => {
    return productsData?.products || [];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        product.category?.toLowerCase() === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        getProductStatus(product.stock) === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id).unwrap();
      toast.success("Product Deleted", {
        description: `"${productToDelete.name}" has been successfully removed.`,
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error("Delete Failed", {
        description:
          error?.data?.message || "Failed to delete product. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Package className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground font-medium">Failed to load products</p>
          <p className="text-muted-foreground text-sm">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-sans text-2xl lg:text-3xl font-semibold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all products, inventory and catalog
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button
            variant="default"
            onClick={() => router.push("/admin-dashboard/products/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <h3 className="font-sans text-2xl font-semibold mt-1">
                  {allProducts.length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-brand-soft flex items-center justify-center">
                <Package className="h-6 w-6 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Products
                </p>
                <h3 className="font-sans text-2xl font-semibold mt-1">
                  {allProducts.filter((p: any) => p.stock > 0).length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </p>
                <h3 className="font-sans text-2xl font-semibold mt-1">
                  {allProducts.filter((p: any) => p.stock === 0).length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <h3 className="font-sans text-2xl font-semibold mt-1">
                  {new Set(allProducts.map((p: any) => p.category)).size}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-brand-soft flex items-center justify-center">
                <Package className="h-6 w-6 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="signage">Signage</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground/70 mx-auto mb-2" />
                    <p className="text-muted-foreground">No products found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product: any) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-brand-soft to-card flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                            {product.name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">
                      ${product.price}
                      {product.discountPrice ? (
                        <span className="text-success text-xs ml-1">
                          (disc: ${product.discountPrice})
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={getProductStatusColor(product.stock)}>
                        {getProductStatus(product.stock)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin-dashboard/products/${product._id}/edit`,
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-brand hover:bg-destructive/10"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary hover:bg-brand-hover"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
