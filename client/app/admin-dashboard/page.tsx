"use client";

import React, { useMemo } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
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
} from "recharts";
import { useGetOrdersByUserQuery } from "@/services/ordersApi";
import { useGetProductsQuery } from "@/services/productsApi";
import { useGetAllCustomersQuery } from "@/services/userApi";

const getStatusColor = (status: string) => {
  const normalized = status?.toLowerCase() ?? "";
  switch (normalized) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const AdminDashboard = () => {
  const currentUser = useSelector(selectUser);

  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetOrdersByUserQuery();
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();
  const {
    data: customers,
    isLoading: customersLoading,
    isError: customersError,
  } = useGetAllCustomersQuery();

  const isLoading = ordersLoading || productsLoading || customersLoading;
  const hasError = ordersError || productsError || customersError;

  // API responses are wrapped: { success, orders, count }, { success, products, count }, { customers }
  const orderList = Array.isArray(orders)
    ? orders
    : Array.isArray(orders?.orders)
      ? orders.orders
      : [];
  const productList = Array.isArray(products)
    ? products
    : Array.isArray(products?.products)
      ? products.products
      : [];
  const customerList = Array.isArray(customers) ? customers : [];

  const statsCards = useMemo(() => {
    const totalRevenue = orderList.reduce(
      (sum: number, o: any) => sum + (o.totalAmount ?? o.amount ?? 0),
      0,
    );
    const totalOrders = orderList.length;
    const totalProducts = productList.length;
    const totalCustomers = customerList.length;

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(totalRevenue),
        change: `${totalOrders > 0 ? "+" : ""}${totalOrders} orders`,
        trend: totalOrders > 0 ? "up" : ("down" as const),
        icon: DollarSign,
      },
      {
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: `${orderList.filter((o: any) => ["delivered", "completed"].includes(o.orderStatus?.toLowerCase() ?? "")).length} completed`,
        trend: "up" as const,
        icon: ShoppingCart,
      },
      {
        title: "Total Customers",
        value: totalCustomers.toLocaleString(),
        change: `${customerList.filter((c: any) => c.isActive !== false).length} active`,
        trend: totalCustomers > 0 ? "up" : ("down" as const),
        icon: Users,
      },
      {
        title: "Total Products",
        value: totalProducts.toLocaleString(),
        change: `${productList.filter((p: any) => p.stock ?? p.inStock ?? true).length} in stock`,
        trend: totalProducts > 0 ? "up" : ("down" as const),
        icon: Package,
      },
    ];
  }, [orders, products, customers]);

  const salesData = useMemo(() => {
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
      const monthOrders = orderList.filter((o: any) => {
        const date = o.createdAt ? new Date(o.createdAt) : null;
        return date && date.getMonth() === idx;
      });
      const value = monthOrders.reduce(
        (sum: number, o: any) => sum + (o.totalAmount ?? o.amount ?? 0),
        0,
      );
      return { name, value };
    });
  }, [orders]);

  const orderData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();

    return days.map((name, idx) => {
      const dayOrders = orderList.filter((o: any) => {
        const date = o.createdAt ? new Date(o.createdAt) : null;
        return (
          date &&
          date.getDay() === idx &&
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      });
      return { name, orders: dayOrders.length };
    });
  }, [orders]);

  const recentOrders = useMemo(() => {
    return orderList
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )
      .slice(0, 5)
      .map((order: any) => ({
        id: order.orderId ?? order._id ?? "#N/A",
        customer:
          order.shippingAddress?.fullName ??
          order.user?.name ??
          order.name ??
          "Unknown",
        email:
          order.shippingAddress?.email ??
          order.user?.email ??
          order.email ??
          "",
        amount: formatCurrency(order.totalAmount ?? order.amount ?? 0),
        status: order.orderStatus ?? order.status ?? "Pending",
        date: order.createdAt ? timeAgo(new Date(order.createdAt)) : "N/A",
      }));
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-500 mb-6">
            There was an error fetching the data. Please check your connection
            and try again.
          </p>
          <Button variant="default" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="default" onClick={() => window.location.reload()}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Avatar>
            <AvatarFallback>
              {currentUser?.name?.[0] || currentUser?.email?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <div
                    className={`flex items-center mt-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Monthly sales performance for the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ fill: "#16a34a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Day</CardTitle>
            <CardDescription>Today's order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="orders" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin-dashboard/orders">View All</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        {order.email && (
                          <div className="text-sm text-gray-500">
                            {order.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/admin-dashboard/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/admin-dashboard/orders/${order.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 7) return date.toLocaleDateString();
  if (diffDay > 1) return `${diffDay} days ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffHr > 1) return `${diffHr} hours ago`;
  if (diffHr === 1) return "1 hour ago";
  if (diffMin > 1) return `${diffMin} minutes ago`;
  if (diffMin === 1) return "1 minute ago";
  return "Just now";
}

export default AdminDashboard;
