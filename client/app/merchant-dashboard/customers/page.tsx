"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Eye,
  ShoppingCart,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  ArrowLeft,
  User,
  Filter,
  TrendingUp,
  Award,
  Star,
  Sparkles,
  MapPin,
  Clock,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllCustomersQuery } from "@/services/userApi";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: customersData, isLoading, isError } = useGetAllCustomersQuery();

  const customers = customersData || [];

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer: any) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchQuery)),
    );
  }, [customers, searchQuery]);

  const customerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce(
      (sum: number, customer: any) =>
        sum + (customer.orderStats?.totalSpent || 0),
      0,
    );
    const averageOrderValue =
      totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const activeCustomers = customers.filter((c: any) => c.isActive).length;
    const totalOrders = customers.reduce(
      (sum: number, c: any) => sum + (c.orderStats?.totalOrders || 0),
      0,
    );

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      averageOrderValue,
      totalOrders,
    };
  }, [customers]);

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
        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.totalCustomers}
              </div>
              <p className="text-[10px] text-blue-200 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Registered users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                ₹{customerStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-emerald-200">
                Customer lifetime value
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Active Customers
              </CardTitle>
              <Award className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.activeCustomers}
              </div>
              <p className="text-[10px] text-purple-200">
                {customerStats.totalCustomers > 0
                  ? `${Math.round((customerStats.activeCustomers / customerStats.totalCustomers) * 100)}% active rate`
                  : "0% active"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Avg Order Value
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                ₹{customerStats.averageOrderValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-orange-200">Per customer</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-white/80">
                Total Orders
              </CardTitle>
              <Star className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.totalOrders}
              </div>
              <p className="text-[10px] text-rose-200">Across all customers</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 dark:bg-gray-800/20 rounded-xl p-4 border border-gray-100 dark:border-gray-700/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <span>
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Customers List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
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
              Failed to load customers.
            </p>
            <p className="text-red-500/70 text-sm mt-1">
              Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer: any, index: number) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-orange-100 dark:ring-orange-900/30 ring-offset-2 dark:ring-offset-gray-900">
                          <AvatarImage
                            src={customer.image}
                            alt={customer.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 font-bold text-lg">
                            {customer.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900",
                            customer.isActive ? "bg-green-500" : "bg-gray-400",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {customer.name}
                        </h3>
                        <Badge
                          className={cn(
                            "mt-1 text-xs",
                            customer.isActive
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
                          )}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {customer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {customer.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400">
                        Joined{" "}
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {customer.orderStats?.totalOrders || 0}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Orders
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-900/10 rounded-lg">
                      <IndianRupee className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ₹
                        {(
                          customer.orderStats?.totalSpent || 0
                        ).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Spent
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/10 rounded-lg">
                      <Star className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {customer.orderStats?.lastOrderDate
                          ? Math.ceil(
                              (Date.now() -
                                new Date(
                                  customer.orderStats.lastOrderDate,
                                ).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                          : "-"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Days ago
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/30">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-600 hover:text-orange-700 dark:border-orange-900 dark:hover:bg-orange-900/20 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/20">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No customers found" : "No customers yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query."
                : "Customers will appear here once they register and make purchases."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
