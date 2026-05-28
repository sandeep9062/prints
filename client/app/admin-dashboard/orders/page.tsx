"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  useGetOrdersByUserQuery,
  useUpdateOrderStatusMutation,
} from "@/services/ordersApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface OrderItem {
  product?: { name?: string; images?: string[]; price?: number };
  quantity: number;
  price: number;
  customization?: Record<string, unknown>;
}

interface OrderAddress {
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
  address?: OrderAddress;
  user?: OrderUser;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <RefreshCw className="h-3 w-3" />,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <Truck className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <X className="h-3 w-3" />,
  },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "Paid", color: "bg-green-50 text-green-700" },
  failed: { label: "Failed", color: "bg-red-50 text-red-700" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-600" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Stats Card Component
// ---------------------------------------------------------------------------
function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Order Detail Modal
// ---------------------------------------------------------------------------
function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  if (!order) return null;

  const statusInfo = statusConfig[order.orderStatus] || statusConfig.pending;
  const paymentInfo =
    paymentConfig[order.paymentStatus] || paymentConfig.pending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order #{order._id.slice(-8).toUpperCase()}
            <Badge variant="secondary" className={statusInfo.color}>
              <span className="flex items-center gap-1">
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Customer
            </h4>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(order.user?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user?.name || "N/A"}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          {order.address && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Shipping Address
              </h4>
              <div className="text-sm text-gray-700 space-y-0.5">
                {order.address.fullName && <p>{order.address.fullName}</p>}
                {order.address.street && <p>{order.address.street}</p>}
                <p>
                  {[order.address.city, order.address.state, order.address.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {order.address.phone && <p>{order.address.phone}</p>}
              </div>
            </div>
          )}

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Items ({order.items?.length || 0})
            </h4>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name || "Product"}
                      className="h-14 w-14 rounded-md object-cover bg-white"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.product?.name || "Custom Product"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Payment
              </h4>
              <Badge variant="secondary" className={paymentInfo.color}>
                {paymentInfo.label}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">
                {order.paymentMethod || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Total
              </h4>
              <p className="text-xl font-bold">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Update Status */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Update Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={order.orderStatus === key ? "default" : "outline"}
                  className={
                    order.orderStatus === key ? cfg.color.split(" ")[0] : ""
                  }
                  onClick={() => onUpdateStatus(order._id, key)}
                  disabled={order.orderStatus === key}
                >
                  <span className="flex items-center gap-1">
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const AdminOrders = () => {
  // ---- RQ hooks ----
  const { data, isLoading, isError, error, refetch } =
    useGetOrdersByUserQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  // ---- Local state ----
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // ---- Derived data ----
  const orders: Order[] = data?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        !searchQuery ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  // ---- Stats ----
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.orderStatus === "pending").length;
    const processing = orders.filter(
      (o) => o.orderStatus === "processing",
    ).length;
    const delivered = orders.filter(
      (o) => o.orderStatus === "delivered",
    ).length;
    const revenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { total, pending, processing, delivered, revenue };
  }, [orders]);

  // ---- Actions ----
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id, orderStatus: newStatus }).unwrap();
      toast({
        title: "Status Updated",
        description: `Order status changed to ${statusConfig[newStatus]?.label || newStatus}`,
      });
      setDetailOpen(false);
      setSelectedOrder(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to update order status";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // API endpoint for order deletion is not implemented in backend,
    // but we keep the UI flow. Show a toast indicating it's a placeholder.
    toast({
      title: "Delete Order",
      description: `Order #${orderToDelete?._id.slice(-8).toUpperCase()} deletion is not available via API yet.`,
    });
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // ---- Reset page when filters change ----
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  // ---- Render helpers ----
  const renderStatusBadge = (status: string) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant="outline" className={`${cfg.color} border`}>
        <span className="flex items-center gap-1">
          {cfg.icon}
          {cfg.label}
        </span>
      </Badge>
    );
  };

  const renderPaymentBadge = (status: string) => {
    const cfg = paymentConfig[status] || paymentConfig.pending;
    return (
      <Badge variant="secondary" className={cfg.color}>
        {cfg.label}
      </Badge>
    );
  };

  // ---- Loading skeleton ----
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Table skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Error state ----
  if (isError) {
    const errMsg =
      error && typeof error === "object" && "data" in error
        ? (error as { data: { message?: string } }).data?.message
        : "Failed to load orders";
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to Load Orders
        </h2>
        <p className="text-gray-500 mb-6">{errMsg}</p>
        <Button onClick={refetch} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // ---- Empty state (API returned successfully but no orders) ----
  const showEmpty = !isLoading && !isError && orders.length === 0;

  return (
    <div>
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Global Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingCart className="h-6 w-6 text-blue-700" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-6 w-6 text-yellow-700" />}
          color="bg-yellow-100"
        />
        <StatsCard
          title="Processing"
          value={stats.processing}
          icon={<Package className="h-6 w-6 text-blue-700" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="Delivered"
          value={stats.delivered}
          icon={<CheckCircle className="h-6 w-6 text-green-700" />}
          color="bg-green-100"
        />
        <StatsCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<ShoppingCart className="h-6 w-6 text-purple-700" />}
          color="bg-purple-100"
        />
      </div>

      {/* ==================== FILTERS ==================== */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID, customer name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    {cfg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ==================== ORDERS TABLE ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                {showEmpty
                  ? "No orders found"
                  : `Showing ${filteredOrders.length} of ${orders.length} order${orders.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {showEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">
                No Orders Yet
              </h3>
              <p className="text-sm text-gray-400 text-center max-w-sm">
                Orders placed by customers will appear here. When someone
                completes a checkout, their order will show up in this list.
              </p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Search className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">
                No Matching Orders
              </h3>
              <p className="text-sm text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-sm font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px]">
                                {getInitials(order.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {order.user?.name || "Guest"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.user?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {order.items?.length || 0} item
                          {(order.items?.length || 0) !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(order.orderStatus)}
                        </TableCell>
                        <TableCell>
                          {renderPaymentBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Status update dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={isUpdating}
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {Object.entries(statusConfig).map(
                                  ([key, cfg]) => (
                                    <DropdownMenuItem
                                      key={key}
                                      disabled={order.orderStatus === key}
                                      onClick={() =>
                                        handleUpdateStatus(order._id, key)
                                      }
                                    >
                                      <span className="flex items-center gap-2">
                                        {cfg.icon}
                                        {cfg.label}
                                      </span>
                                    </DropdownMenuItem>
                                  ),
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View details */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(order)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing {(safePage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(safePage * itemsPerPage, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage(safePage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Page {safePage} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage(safePage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ==================== ORDER DETAIL MODAL ==================== */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* ==================== DELETE CONFIRMATION ==================== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order #
              {orderToDelete?._id.slice(-8).toUpperCase()}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrders;
