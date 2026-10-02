"use client";

import React, { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  ShoppingCart,
  Users,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { useGetOrdersByUserQuery } from "@/services/ordersApi";
import { useGetProductsQuery } from "@/services/productsApi";
import { useGetAllCustomersQuery } from "@/services/userApi";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const COLORS = [
  "#16a34a",
  "#4f46e5",
  "#7c3aed",
  "#eab308",
  "#f97316",
  "#ef4444",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface OrderItem {
  product?: {
    name?: string;
    images?: string[];
    price?: number;
    category?: string;
  };
  quantity: number;
  price: number;
}

interface OrderData {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  items?: OrderItem[];
  createdAt: string;
}

interface ProductData {
  _id: string;
  name: string;
  category?: string;
  price?: number;
  stock?: number;
  sales?: number;
}

// ---------------------------------------------------------------------------
// Stats Card
// ---------------------------------------------------------------------------
function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  trendLabel?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1 truncate">{value}</h3>
            {(trend || subtitle) && (
              <div
                className={`flex items-center mt-1 text-sm ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {trend === "up" && (
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                <span className="truncate">{trendLabel || subtitle}</span>
              </div>
            )}
          </div>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ml-4 ${color}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const AdminAnalytics = () => {
  // ---- API hooks ----
  const {
    data: ordersResp,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useGetOrdersByUserQuery();
  const {
    data: productsResp,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery();
  const {
    data: customersResp,
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useGetAllCustomersQuery();

  const isLoading = ordersLoading || productsLoading || customersLoading;
  const hasError = ordersError || productsError || customersError;

  // ---- Normalize API responses ----
  const orderList: OrderData[] = useMemo(() => {
    if (!ordersResp) return [];
    if (Array.isArray(ordersResp)) return ordersResp;
    if (Array.isArray((ordersResp as any).orders))
      return (ordersResp as any).orders;
    return [];
  }, [ordersResp]);

  const productList: ProductData[] = useMemo(() => {
    if (!productsResp) return [];
    if (Array.isArray(productsResp)) return productsResp;
    if (Array.isArray((productsResp as any).products))
      return (productsResp as any).products;
    return [];
  }, [productsResp]);

  const customerList: any[] = useMemo(() => {
    if (!customersResp) return [];
    if (Array.isArray(customersResp)) return customersResp;
    return [];
  }, [customersResp]);

  // ---- Stats computation ----
  const stats = useMemo(() => {
    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalCustomers = customerList.length;
    const totalProducts = productList.length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentRevenue = orderList
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);

    const prevRevenue = orderList
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);

    const revenueGrowth =
      prevRevenue > 0
        ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
        : currentRevenue > 0
          ? 100
          : 0;

    const completedOrders = orderList.filter(
      (o) =>
        o.orderStatus?.toLowerCase() === "delivered" ||
        o.orderStatus?.toLowerCase() === "completed",
    ).length;

    const completedRate =
      totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    const paidOrders = orderList.filter(
      (o) => o.paymentStatus === "paid",
    ).length;
    const pendingPayment = orderList.filter(
      (o) => o.paymentStatus === "pending",
    ).length;

    return {
      totalRevenue,
      avgOrderValue,
      totalOrders,
      totalCustomers,
      totalProducts,
      currentRevenue,
      revenueGrowth,
      completedOrders,
      completedRate,
      paidOrders,
      pendingPayment,
    };
  }, [orderList, customerList, productList]);

  // ---- Sales by month (line chart) ----
  const salesByMonth = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((name, idx) => {
      const monthOrders = orderList.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === idx;
      });
      const sales = monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const orders = monthOrders.length;
      return { name, sales, orders };
    });
  }, [orderList]);

  // ---- Orders by day of week (bar chart) ----
  const ordersByDay = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((name, idx) => {
      const count = orderList.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getDay() === idx;
      }).length;
      return { name, orders: count };
    });
  }, [orderList]);

  // ---- Category distribution (pie chart) ----
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    orderList.forEach((order) => {
      (order.items || []).forEach((item) => {
        const cat = item.product?.category || "Other";
        const qty = item.quantity || 1;
        map.set(cat, (map.get(cat) || 0) + qty);
      });
    });
    if (map.size === 0) {
      productList.forEach((p) => {
        const cat = p.category || "Other";
        map.set(cat, (map.get(cat) || 0) + 1);
      });
    }
    return Array.from(map.entries())
      .map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [orderList, productList]);

  // ---- Top products by sales volume ----
  const topProducts = useMemo(() => {
    const map = new Map<
      string,
      { name: string; qty: number; revenue: number }
    >();
    orderList.forEach((order) => {
      (order.items || []).forEach((item) => {
        const pid = item.product?.name || "Unknown";
        const existing = map.get(pid) || {
          name: item.product?.name || "Unknown",
          qty: 0,
          revenue: 0,
        };
        existing.qty += item.quantity || 1;
        existing.revenue += item.price * (item.quantity || 1);
        map.set(pid, existing);
      });
    });
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orderList]);

  // ---- Status distribution ----
  const statusDistribution = useMemo(() => {
    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const labels: Record<string, string> = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statuses
      .map((key, i) => ({
        name: labels[key] || key,
        value: orderList.filter((o) => o.orderStatus?.toLowerCase() === key)
          .length,
        color: COLORS[i % COLORS.length],
      }))
      .filter((d) => d.value > 0);
  }, [orderList]);

  // ---- Refresh all ----
  const handleRefresh = () => {
    refetchOrders();
    refetchProducts();
    refetchCustomers();
    toast({
      title: "Refreshing",
      description: "Fetching latest analytics data...",
    });
  };

  // ---- Loading skeleton ----
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-28 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Error state ----
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to Load Analytics
        </h2>
        <p className="text-gray-500 mb-6 max-w-md text-center">
          There was an error fetching analytics data. Please check your
          connection and try again.
        </p>
        <Button onClick={handleRefresh} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const revGrowthLabel =
    stats.revenueGrowth >= 0
      ? `+${stats.revenueGrowth.toFixed(1)}% from last month`
      : `${stats.revenueGrowth.toFixed(1)}% from last month`;

  return (
    <div>
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Sales Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Detailed reports and performance insights
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          trend={stats.revenueGrowth >= 0 ? "up" : "down"}
          trendLabel={revGrowthLabel}
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          subtitle={`${stats.completedOrders} completed (${stats.completedRate.toFixed(0)}%)`}
          icon={ShoppingCart}
          color="bg-blue-100 text-blue-700"
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-purple-100 text-purple-700"
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          icon={BarChart3}
          color="bg-orange-100 text-orange-700"
        />
      </div>

      {/* ==================== TABS ==================== */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* ---- Overview Tab ---- */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales line chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesByMonth.every((d) => d.sales === 0 && d.orders === 0) ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <BarChart3 className="h-10 w-10 mb-2" />
                    <p className="text-sm">No sales data available yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        formatter={(value: any) => [
                          formatCurrency(value as number),
                          "Revenue",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ fill: "#16a34a", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Orders by day bar chart */}
            <Card>
              <CardHeader>
                <CardTitle>Orders by Day of Week</CardTitle>
                <CardDescription>Total orders grouped by day</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersByDay.every((d) => d.orders === 0) ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <BarChart3 className="h-10 w-10 mb-2" />
                    <p className="text-sm">No order data available yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ordersByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip />
                      <Bar
                        dataKey="orders"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Category distribution pie chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Products / items by category</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <Package className="h-10 w-10 mb-2" />
                    <p className="text-sm">No category data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }: any) =>
                          `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell key={`cat-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Status distribution pie chart */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Breakdown</CardTitle>
                <CardDescription>Current status of all orders</CardDescription>
              </CardHeader>
              <CardContent>
                {statusDistribution.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <ShoppingCart className="h-10 w-10 mb-2" />
                    <p className="text-sm">No orders to display</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }: any) =>
                          `${name ?? ""}: ${value ?? 0}`
                        }
                      >
                        {statusDistribution.map((entry, idx) => (
                          <Cell key={`status-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- Sales Tab ---- */}
        <TabsContent value="sales">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Paid Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.paidOrders}</p>
                  <p className="text-xs text-gray-400">
                    Out of {stats.totalOrders} total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.pendingPayment}</p>
                  <p className="text-xs text-gray-400">Awaiting payment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {stats.completedRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {stats.completedOrders} of {stats.totalOrders} delivered
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>
                  Revenue and order count by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesByMonth.every((d) => d.sales === 0 && d.orders === 0) ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                    <BarChart3 className="h-10 w-10 mb-2" />
                    <p className="text-sm">No sales data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          name === "sales"
                            ? formatCurrency(value as number)
                            : value,
                          name === "sales" ? "Revenue" : "Orders",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="sales"
                        fill="#16a34a"
                        radius={[4, 4, 0, 0]}
                        name="Revenue"
                      />
                      <Bar
                        dataKey="orders"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                        name="Orders"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- Products Tab ---- */}
        <TabsContent value="products">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{categoryData.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Top Product Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {topProducts
                      .reduce((s, p) => s + p.qty, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Units sold (top 5)</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Products by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                      <Package className="h-10 w-10 mb-2" />
                      <p className="text-sm">No categories available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }: any) =>
                            `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, idx) => (
                            <Cell key={`cat2-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    Best performing products by units sold
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                      <Package className="h-10 w-10 mb-2" />
                      <p className="text-sm">No product sales data yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">
                              Units Sold
                            </TableHead>
                            <TableHead className="text-right">
                              Revenue
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topProducts.map((p, idx) => (
                            <TableRow key={p.name}>
                              <TableCell className="font-medium text-gray-400">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-medium truncate max-w-[200px]">
                                {p.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {p.qty}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(p.revenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-gray-50 to-white border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Analytics last updated from live data
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {stats.totalOrders} orders · {stats.totalProducts} products ·{" "}
                {stats.totalCustomers} customers
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 self-start"
            >
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
