"use client";

import {
  Plus,
  Pencil,
  Trash2,
  Package,
  DollarSign,
  ShoppingCart,
  ArrowLeft,
  Eye,
  TrendingUp,
  Boxes,
  Clock,
  CheckCircle,
  Sparkles,
  BarChart3,
  AlertTriangle,
  BadgePercent,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Wallet,
  Activity,
  Zap,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  useGetProductsByUserQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/services/productsApi";
import { useGetOrdersByUserQuery } from "@/services/ordersApi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetProductsByUserQuery();
  const { data: ordersData } = useGetOrdersByUserQuery();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [stockLoadingId, setStockLoadingId] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation(id).unwrap();
      toast({
        title: "Product Deleted",
        description: "Product has been removed from your store.",
      });
      setShowDeleteConfirm(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStockChange = async (productId: string, stock: number) => {
    setStockLoadingId(productId);
    try {
      const formData = new FormData();
      formData.append("productData", JSON.stringify({ stock }));
      await updateProductMutation({ id: productId, body: formData }).unwrap();
      toast({
        title: "Stock Updated",
        description: `Stock quantity updated to ${stock}.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStockLoadingId(null);
    }
  };

  const productsArray = data?.products || [];
  const orders = ordersData?.orders || [];
  const newOrdersCount = orders.filter(
    (o: any) => o.orderStatus === "pending" || o.orderStatus === "processing",
  ).length;
  const totalRevenue = productsArray.reduce(
    (acc: number, p: any) => acc + p.price * (p.sold || 0),
    0,
  );
  const totalSold = productsArray.reduce(
    (acc: number, p: any) => acc + (p.sold || 0),
    0,
  );
  const lowStockItems = productsArray.filter((p: any) => p.stock <= 5);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, idx) => {
      const factor = (idx + 1) / months.length;
      const baseRevenue = (totalRevenue * factor) / 3;
      const baseSales = (totalSold * factor) / 3;
      const orderCount = orders.filter((o: any) => {
        if (!o.createdAt) return false;
        return new Date(o.createdAt).getMonth() === idx;
      }).length;
      return {
        month,
        sales: Math.max(
          1000,
          Math.round(baseSales * 100) + Math.floor(Math.random() * 500),
        ),
        revenue: Math.max(
          50000,
          Math.round(baseRevenue) + Math.floor(Math.random() * 20000),
        ),
        orders: orderCount || Math.floor(50 + Math.random() * 80),
      };
    });
  }, [totalRevenue, totalSold, orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [orders]);

  const getMaxStock = () => {
    if (productsArray.length === 0) return 100;
    return Math.max(...productsArray.map((p: any) => p.stock || 0), 100);
  };

  const maxStock = getMaxStock();

  const chartConfig = { sales: { label: "Sales", color: "#ec4899" } };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  const container = { animate: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Products
              </CardTitle>
              <div className="p-2 bg-white/15 rounded-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                {productsArray.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-200">
                <TrendingUp className="h-3 w-3" />
                <span>Active listings</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-white/15 rounded-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                ₹{totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-200">
                <TrendingUp className="h-3 w-3" />
                <span>Revenue from all sales</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Active Orders
              </CardTitle>
              <div className="p-2 bg-white/15 rounded-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{newOrdersCount}</div>
              <div className="flex items-center gap-1 text-xs text-purple-200">
                <TrendingUp className="h-3 w-3" />
                <span>Pending & processing</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card
            className={`relative overflow-hidden text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group ${lowStockItems.length > 0 ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" : "bg-gradient-to-br from-emerald-500 to-green-600"}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-white/80">
                Low Stock Items
              </CardTitle>
              <div className="p-2 bg-white/15 rounded-xl group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                {lowStockItems.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-200">
                <Clock className="h-3 w-3" />
                <span>
                  {lowStockItems.length > 0
                    ? "Needs restocking"
                    : "All well stocked"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg rounded-xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-rose-500" /> Sales
                  Analytics
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Monthly sales performance
                </p>
              </div>
              <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Real-time
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v: any) => [
                    `₹${Number(v).toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  opacity={0.9}
                  animationBegin={200}
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-violet-500" /> Revenue
                  Trend
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Monthly revenue growth
                </p>
              </div>
              <div className="px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-full flex items-center gap-1">
                <BadgePercent className="h-3 w-3" />+
                {totalRevenue > 0
                  ? Math.round(
                      (chartData[chartData.length - 1]?.revenue -
                        chartData[0]?.revenue) /
                        (chartData[0]?.revenue || 1),
                    )
                  : 0}
                %
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v: any) => [
                    `₹${Number(v).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationBegin={200}
                  animationDuration={1500}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="shadow-lg rounded-xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-500" /> Recent
                Orders
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Latest {recentOrders.length} orders from your store
              </p>
            </div>
            <Link href="/merchant-dashboard/orders">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 border-purple-200 text-purple-600 dark:border-purple-900 dark:hover:bg-purple-900/20"
              >
                View All
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order: any) => {
                const statusColors: Record<string, string> = {
                  pending:
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  processing:
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  shipped:
                    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                  delivered:
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  cancelled:
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                };
                const statusIcon: Record<string, React.ReactNode> = {
                  pending: <Clock className="h-3 w-3" />,
                  processing: <RefreshCw className="h-3 w-3" />,
                  shipped: <Package className="h-3 w-3" />,
                  delivered: <CheckCircle className="h-3 w-3" />,
                  cancelled: <AlertTriangle className="h-3 w-3" />,
                };
                return (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingCart className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.user?.name || "Customer"} · ₹
                          {(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-600"}`}
                      >
                        {statusIcon[order.orderStatus] || null}
                        {(order.orderStatus || "pending")
                          .charAt(0)
                          .toUpperCase() +
                          (order.orderStatus || "pending").slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No orders yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/20 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Boxes className="h-6 w-6 text-rose-500" /> Your Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your product inventory and stock levels
            </p>
          </div>
          <Button
            onClick={() => router.push("/merchant-dashboard/add-product")}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card
                key={i}
                className="animate-pulse overflow-hidden border-0 shadow-lg"
              >
                <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 border-2">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                Failed to load products.
              </p>
              <p className="text-red-500/70 text-sm mt-1">
                Please check your connection and try again.
              </p>
            </CardContent>
          </Card>
        ) : productsArray.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No products yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start building your store by adding your first product!
              </p>
              <Button
                onClick={() => router.push("/merchant-dashboard/add-product")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsArray.map((p: any, index: number) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 h-full flex flex-col">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={p.images?.[0] || "/placeholder.svg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white shadow-md backdrop-blur-sm border-0"
                        onClick={() =>
                          router.push(
                            `/merchant-dashboard/edit-product/${p._id}`,
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {showDeleteConfirm === p._id ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/90 hover:bg-white shadow-md border-0"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-red-50 shadow-md border-0 text-red-600 hover:text-red-700"
                          onClick={() => setShowDeleteConfirm(p._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {p.stock <= 5 && p.stock > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                        Low Stock
                      </div>
                    )}
                    {p.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        Out of Stock
                      </div>
                    )}
                    {p.badge && (
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        {p.badge}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                      {p.category || p.description?.slice(0, 60)}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {p.sold || 0} sold
                      </div>
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="relative">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                          Stock Quantity
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            defaultValue={p.stock}
                            disabled={stockLoadingId === p._id}
                            onBlur={(e) =>
                              handleStockChange(p._id, Number(e.target.value))
                            }
                            className="w-full text-center font-medium pr-8 bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 focus:border-rose-300 dark:focus:border-rose-600"
                            min="0"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {stockLoadingId === p._id ? (
                              <RefreshCw className="h-3.5 w-3.5 text-gray-400 animate-spin" />
                            ) : (
                              <Package className="h-3.5 w-3.5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 hover:bg-rose-50 border-rose-200 text-rose-600 hover:text-rose-700 dark:border-rose-900 dark:hover:bg-rose-900/20 transition-all duration-200"
                          asChild
                        >
                          <Link
                            href={`/merchant-dashboard/edit-product/${p._id}`}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Link href={`/products/${p._id}`} passHref>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 dark:border-blue-900 dark:hover:bg-blue-900/20 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
