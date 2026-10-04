"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
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
import { Switch } from "@/components/ui/switch";
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
  useGetAllProductsAdminQuery,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
  productsApi,
} from "@/services/productsApi";
import { formatINR } from "@/lib/utils";

// Status is now a real persisted field (`status: "active" | "inactive"`),
  // NOT a derivation from stock. Products created before the field existed have
  // no `status`, so anything other than an explicit "inactive" reads as active.
  const getProductStatus = (product: any) =>
    product?.status === "inactive" ? "inactive" : "active";

  const getProductStatusLabel = (product: any) =>
    getProductStatus(product) === "active" ? "Active" : "Inactive";

  const getProductStatusColor = (product: any) =>
    getProductStatus(product) === "active"
      ? "bg-success/10 text-success"
      : "bg-muted text-muted-foreground";

const AdminProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  // RTK Query hooks
  // Admin listing (includes inactive) — the public getProducts omits hidden
  // products, which would make a hidden product impossible to re-enable here.
  const { data: productsData, isLoading, isError } = useGetAllProductsAdminQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  // No aggregate `isLoading` needed — the per-row `updatingStatusId` drives the
  // disabled state, so only the row being saved greys out.
  const [updateProductStatus] = useUpdateProductStatusMutation();
  // Product ids currently being written, so only the row being saved shows a
  // spinner instead of disabling every toggle in the table.
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const allProducts = useMemo(() => {
    return productsData?.products || [];
  }, [productsData]);

  // The category filter used to be a hardcoded list of "printing" / "design" /
  // "signage", but `category` is a free-form String in the Product model and the
  // real data uses values like "Wedding Cards", "Vinyl Decals" and "Brochures" —
  // so two of the three options matched no products at all. Derive the options
  // from the loaded catalogue (with counts) so every real category is filterable.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of allProducts as any[]) {
      const name = product?.category?.trim();
      if (!name) continue; // uncategorised products stay under "All Categories"
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      // Compare case-insensitively on BOTH sides: the dropdown now supplies the
      // exact category name ("Wedding Cards"), while the old check only
      // lowercased the product, so a real category name could never match.
      const matchesCategory =
        categoryFilter === "all" ||
        product.category?.trim().toLowerCase() === categoryFilter.toLowerCase();
      // The filter stores the raw value ("active"/"inactive"), so compare against
        // `getProductStatus(product)` rather than the display label.
        const matchesStatus =
          statusFilter === "all" ||
          getProductStatus(product) === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Narrowing the search/filters while on a later page used to leave
  // `currentPage` past the end, rendering an empty table with no way back
  // except the arrows. Clamp for display and keep the state in sync so the
  // "Showing X to Y" readout and the page indicator stay truthful.
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  if (safePage !== currentPage) setCurrentPage(safePage);

  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const handleDelete = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Flip a product's published state. The switch reflects the new value
  // immediately (optimistic) and reverts itself if the PATCH fails, so the
  // toggle never lies about what was actually saved.
  const handleToggleStatus = async (product: any) => {
    const nextStatus = getProductStatus(product) === "active" ? "inactive" : "active";

    setUpdatingStatusId(product._id);

    // Patch the cached list in place so the row re-renders instantly instead of
    // waiting on the refetch triggered by invalidatesTags. Must be dispatched;
    // the dispatched result carries `.undo()` for the rollback below.
    const patch = dispatch(
      productsApi.util.updateQueryData(
        "getAllProductsAdmin",
        undefined,
        (draft) => {
          const match = draft?.products?.find((p: any) => p._id === product._id);
          if (match) match.status = nextStatus;
        },
      ),
    );

    try {
      await updateProductStatus({ id: product._id, status: nextStatus }).unwrap();

      toast.success(
        nextStatus === "active" ? "Product Activated" : "Product Deactivated",
        {
          description: `"${product.name}" is now ${
            nextStatus === "active" ? "visible in the store" : "hidden from the store"
          }.`,
        },
      );
    } catch (error: any) {
      patch.undo(); // put the switch back where it was
      toast.error("Status Update Failed", {
        description:
          error?.data?.message || "Failed to update product status. Please try again.",
      });
    } finally {
      setUpdatingStatusId(null);
    }
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
                  {allProducts.filter((p: any) => getProductStatus(p) === "active").length}
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
                  Inactive
                </p>
                <h3 className="font-sans text-2xl font-semibold mt-1">
                  {allProducts.filter((p: any) => getProductStatus(p) === "inactive").length}
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
                  {/* Uses the same de-duplicated, blank-skipping list as the filter dropdown,
                  so this total always equals the number of category options. */}
                  {categories.length}
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                      {formatINR(product.price)}
                      {product.discountPrice ? (
                        <span className="text-success text-xs ml-1">
                          (disc: {formatINR(product.discountPrice)})
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Publish toggle. `checked` is derived from the persisted
                            field, so it always shows the saved state. */}
                        <Switch
                          checked={getProductStatus(product) === "active"}
                          disabled={updatingStatusId === product._id}
                          onCheckedChange={() => handleToggleStatus(product)}
                          aria-label={`Toggle status for ${product.name}`}
                        />
                        <Badge className={getProductStatusColor(product)}>
                          {getProductStatusLabel(product)}
                        </Badge>
                      </div>
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
                Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(safePage * itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(safePage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {safePage} of {totalPages || 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={safePage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(safePage + 1)}
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
