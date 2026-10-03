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
import { toast } from "sonner";

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetProductsByUserQuery();
  const { data: ordersData } = useGetOrdersByUserQuery();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [stockLoadingId, setStockLoadingId] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation(id).unwrap();
      toast.success("Product Deleted", {
        description: "Product has been removed from your store.",
      });
      setShowDeleteConfirm(null);
    } catch (err) {
      toast.error("Error", {
        description: "Failed to delete product. Please try again.",
      });
    }
  };

  const handleStockChange = async (productId: string, stock: number) => {
    setStockLoadingId(productId);
    try {
      const formData = new FormData();
      formData.append("productData", JSON.stringify({ stock }));
      await updateProductMutation({ id: productId, body: formData }).unwrap();
      toast.success("Stock Updated", {
        description: `Stock quantity updated to ${stock}.`,
      });
    } catch (err) {
      toast.error("Error", {
        description: "Failed to update stock. Please try again.",
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

  const chartConfig = { sales: { label: "Sales", color: "hsl(var(--chart-3))" } };

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
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Total Products
              </CardTitle>
              <div className="p-2 bg-card/15 rounded-xl group-hover:bg-card/25 group-hover:scale-110 transition-all duration-300">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                {productsArray.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Active listings</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Total Revenue
              </CardTitle>
              <div className="p-2 bg-card/15 rounded-xl group-hover:bg-card/25 group-hover:scale-110 transition-all duration-300">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                ₹{totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 text-xs text-brand">
                <TrendingUp className="h-3 w-3" />
                <span>Revenue from all sales</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Active Orders
              </CardTitle>
              <div className="p-2 bg-card/15 rounded-xl group-hover:bg-card/25 group-hover:scale-110 transition-all duration-300">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">{newOrdersCount}</div>
              <div className="flex items-center gap-1 text-xs text-brand">
                <TrendingUp className="h-3 w-3" />
                <span>Pending & processing</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card
            className={`relative overflow-hidden text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group ${lowStockItems.length > 0 ? "bg-gradient-to-br from-brand via-brand to-brand-hover" : "bg-gradient-to-br from-brand to-brand-hover"}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-card/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-card/5 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Low Stock Items
              </CardTitle>
              <div className="p-2 bg-card/15 rounded-xl group-hover:bg-card/25 group-hover:scale-110 transition-all duration-300">
                <AlertTriangle className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-1">
                {lowStockItems.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-gold-text dark:text-gold">
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
        <Card className="shadow-lg rounded-xl bg-card/80 dark:bg-card/40 backdrop-blur-sm border border-border dark:border-border/50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-foreground dark:text-primary-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand" /> Sales
                  Analytics
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                  Monthly sales performance
                </p>
              </div>
              <div className="px-3 py-1.5 bg-brand-soft dark:bg-footer/20 text-brand dark:text-brand text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Real-time
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
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
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-3))" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-card/80 dark:bg-card/40 backdrop-blur-sm border border-border dark:border-border/50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-foreground dark:text-primary-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand" /> Revenue
                  Trend
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                  Monthly revenue growth
                </p>
              </div>
              <div className="px-3 py-1.5 bg-brand-soft dark:bg-brand-soft/20 text-brand dark:text-brand text-xs font-medium rounded-full flex items-center gap-1">
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
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
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
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 4 }}
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
      <Card className="shadow-lg rounded-xl bg-card/80 dark:bg-card/40 backdrop-blur-sm border border-border dark:border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground dark:text-primary-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brand" /> Recent
                Orders
              </CardTitle>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                Latest {recentOrders.length} orders from your store
              </p>
            </div>
            <Link href="/merchant-dashboard/orders">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-brand-soft border-brand/40 text-brand dark:border-brand/60 dark:hover:bg-brand-soft/20"
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
                    "bg-gold/15 text-gold-text dark:bg-footer/30 dark:text-gold",
                  processing:
                    "bg-brand-soft text-brand dark:bg-footer/30 dark:text-brand",
                  shipped:
                    "bg-brand-soft text-brand dark:bg-brand-soft/30 dark:text-brand",
                  delivered:
                    "bg-success/10 text-success dark:bg-footer/30 dark:text-brand",
                  cancelled:
                    "bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive",
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
                    className="flex items-center justify-between p-3 bg-muted dark:bg-card/40 rounded-xl hover:bg-muted dark:hover:bg-brand-hover/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-brand-soft to-card dark:from-brand/20 dark:to-brand-hover/20 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingCart className="h-4 w-4 text-brand" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground dark:text-primary-foreground truncate">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                          {order.user?.name || "Customer"} · ₹
                          {(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-muted text-muted-foreground"}`}
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
              <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/70 dark:text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                No orders yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 dark:bg-card/20 rounded-xl p-4 border border-border dark:border-border/30">
          <div>
            <h2 className="font-sans text-2xl font-semibold text-foreground dark:text-primary-foreground flex items-center gap-2">
              <Boxes className="h-6 w-6 text-brand" /> Your Products
            </h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Manage your product inventory and stock levels
            </p>
          </div>
          <Button
            onClick={() => router.push("/merchant-dashboard/add-product")}
            className="bg-gradient-to-r from-brand to-brand-hover hover:from-brand hover:to-brand-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
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
                <div className="h-48 bg-gradient-to-r from-brand-soft to-card dark:from-brand dark:to-brand-hover"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted dark:bg-card rounded w-3/4"></div>
                  <div className="h-6 bg-muted dark:bg-card rounded w-1/2"></div>
                  <div className="h-8 bg-muted dark:bg-card rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive/40 bg-destructive/10 dark:bg-destructive/10 border-2">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive dark:text-destructive font-medium">
                Failed to load products.
              </p>
              <p className="text-destructive/70 text-sm mt-1">
                Please check your connection and try again.
              </p>
            </CardContent>
          </Card>
        ) : productsArray.length === 0 ? (
          <Card className="border-dashed border-2 border-border dark:border-border bg-card/50 dark:bg-card/20 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-soft to-card dark:from-brand/20 dark:to-brand-hover/20 rounded-full flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-brand" />
              </div>
              <h3 className="font-sans text-2xl font-semibold text-foreground dark:text-primary-foreground mb-2">
                No products yet
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-md mx-auto">
                Start building your store by adding your first product!
              </p>
              <Button
                onClick={() => router.push("/merchant-dashboard/add-product")}
                className="bg-gradient-to-r from-brand to-brand-hover hover:from-brand hover:to-brand-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card dark:bg-card/40 backdrop-blur-sm border border-border dark:border-border/30 h-full flex flex-col">
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
                        className="bg-card/90 hover:bg-card shadow-md backdrop-blur-sm border-0"
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
                            className="bg-destructive hover:bg-brand-hover text-primary-foreground shadow-md"
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-card/90 hover:bg-card shadow-md border-0"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-card/90 hover:bg-destructive/10 shadow-md border-0 text-destructive hover:text-brand"
                          onClick={() => setShowDeleteConfirm(p._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {p.stock <= 5 && p.stock > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                        Low Stock
                      </div>
                    )}
                    {p.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        Out of Stock
                      </div>
                    )}
                    {p.badge && (
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-brand to-brand-hover text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        {p.badge}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground dark:text-primary-foreground mb-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-1">
                      {p.category || p.description?.slice(0, 60)}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-brand to-brand-hover dark:from-brand dark:to-brand-hover bg-clip-text text-transparent">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-muted-foreground">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {p.sold || 0} sold
                      </div>
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="relative">
                        <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground mb-1.5 block">
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
                            className="w-full text-center font-medium pr-8 bg-muted dark:bg-card/60 border-border dark:border-border focus:border-brand/40 dark:focus:border-brand"
                            min="0"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {stockLoadingId === p._id ? (
                              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                            ) : (
                              <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 hover:bg-brand-soft border-brand/40 text-brand hover:text-brand dark:border-destructive/50 dark:hover:bg-footer/20 transition-all duration-200"
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
                            className="hover:bg-brand-soft border-brand/40 text-brand hover:text-brand dark:border-brand/60 dark:hover:bg-footer/20 transition-all duration-200"
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
