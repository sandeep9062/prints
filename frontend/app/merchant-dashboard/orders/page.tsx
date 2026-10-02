"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetOrdersByUserQuery,
  useUpdateOrderStatusMutation,
} from "@/services/ordersApi";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Search,
  Eye,
  ShoppingCart,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  IndianRupee,
  Calendar,
  User,
  MapPin,
  Phone,
  TrendingUp,
  Box,
  AlertTriangle,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const orderStatuses = [
  "All",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; gradient: string }
> = {
  delivered: {
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-600",
  },
  shipped: {
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: Truck,
    gradient: "from-blue-500 to-indigo-600",
  },
  processing: {
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    icon: RefreshCw,
    gradient: "from-yellow-500 to-orange-500",
  },
  pending: {
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    icon: Clock,
    gradient: "from-orange-500 to-red-500",
  },
  cancelled: {
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: XCircle,
    gradient: "from-red-500 to-rose-600",
  },
};

const getStatusConfig = (status: string) => {
  const key = status.toLowerCase();
  return (
    statusConfig[key] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Package,
      gradient: "from-gray-500 to-gray-600",
    }
  );
};

const statusFlow = ["pending", "processing", "shipped", "delivered"];

interface TransformedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryDate: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { data: ordersData, isLoading, isError } = useGetOrdersByUserQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { toast } = useToast();

  const orders = ordersData?.orders || [];

  const transformedOrders: TransformedOrder[] = useMemo(() => {
    return orders.map((order: any) => ({
      id: order._id,
      customerName: order.user?.name || "Unknown Customer",
      customerEmail: order.user?.email || "",
      customerPhone: order.user?.phone || "",
      totalAmount: order.totalAmount || 0,
      status: order.orderStatus || "pending",
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      deliveryDate:
        order.orderStatus === "delivered"
          ? new Date(order.updatedAt).toLocaleDateString()
          : null,
      items:
        order.items?.map((item: any) => ({
          name: item.product?.name || "Unknown Product",
          quantity: item.quantity || 0,
          price: item.price || 0,
        })) || [],
      shippingAddress: order.address
        ? `${order.address.street || ""}, ${order.address.city || ""}, ${order.address.state || ""} ${order.address.zipCode || ""}`
        : "Address not available",
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return transformedOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [transformedOrders, statusFilter, searchQuery]);

  const stats = useMemo(
    () => ({
      pending: transformedOrders.filter((o) => o.status === "pending").length,
      processing: transformedOrders.filter((o) => o.status === "processing")
        .length,
      shipped: transformedOrders.filter((o) => o.status === "shipped").length,
      delivered: transformedOrders.filter((o) => o.status === "delivered")
        .length,
      totalRevenue: transformedOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      ),
      totalOrders: transformedOrders.length,
    }),
    [transformedOrders],
  );

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
  ) => {
    try {
      await updateOrderStatus({ id: orderId, orderStatus: newStatus }).unwrap();
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const idx = statusFlow.indexOf(currentStatus);
    return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-purple-200 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                From {stats.totalOrders} orders
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">{stats.pending}</div>
              <p className="text-[10px] text-blue-200">Awaiting processing</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Processing
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">{stats.processing}</div>
              <p className="text-[10px] text-amber-200">In progress</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Delivered
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">{stats.delivered}</div>
              <p className="text-[10px] text-emerald-200">Completed</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 dark:bg-gray-800/20 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "All"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 border-2">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium">
              Failed to load orders.
            </p>
            <p className="text-red-500/70 text-sm mt-1">
              Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/20">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || statusFilter !== "All"
                ? "No matching orders"
                : "No orders yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search."
                : "Orders will appear once customers purchase."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const statusInfo = getStatusConfig(order.status);
              const StatusIcon = statusInfo.icon;
              const nextStatus = getNextStatus(order.status.toLowerCase());
              const isExpanded = expandedOrder === order.id;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              #{order.id.slice(-8).toUpperCase()}
                            </h3>
                            <span className="text-xs text-gray-400">
                              ID: {order.id.slice(0, 8)}...
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {order.orderDate}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold",
                            statusInfo.color,
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                        {[
                          {
                            icon: User,
                            label: "Customer",
                            value: order.customerName,
                          },
                          {
                            icon: IndianRupee,
                            label: "Total",
                            value: `₹${order.totalAmount.toLocaleString()}`,
                            className:
                              "text-green-600 dark:text-green-400 font-bold",
                          },
                          {
                            icon: Box,
                            label: "Items",
                            value: order.items.length,
                          },
                          {
                            icon: Phone,
                            label: "Phone",
                            value: order.customerPhone || "N/A",
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.label}
                              </p>
                              <p
                                className={`text-sm font-medium text-gray-900 dark:text-white truncate ${item.className || ""}`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium transition-colors mb-4"
                      >
                        <span>
                          {isExpanded ? "Hide Details" : "View Details"}
                        </span>
                        <svg
                          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700/30"
                        >
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                                Shipping Address
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {order.shippingAddress}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Box className="h-4 w-4 text-purple-500" />
                              Order Items ({order.items.length})
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700/20"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-lg flex items-center justify-center">
                                      <Package className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      x{item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      ₹
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 pt-2">
                            {order.status.toLowerCase() !== "delivered" &&
                              order.status.toLowerCase() !== "cancelled" &&
                              nextStatus && (
                                <Button
                                  size="sm"
                                  className={cn(
                                    "bg-gradient-to-r text-white shadow-lg hover:shadow-xl",
                                    statusInfo.gradient,
                                  )}
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      order.id,
                                      nextStatus,
                                    )
                                  }
                                >
                                  <Truck className="h-4 w-4 mr-1.5" />
                                  Move to{" "}
                                  {nextStatus.charAt(0).toUpperCase() +
                                    nextStatus.slice(1)}
                                </Button>
                              )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-purple-50 border-purple-200 text-purple-600"
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              Full Details
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
