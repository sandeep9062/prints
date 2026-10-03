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
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-primary-foreground/80">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.totalCustomers}
              </div>
              <p className="text-[10px] text-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Registered users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-primary-foreground/80">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                ₹{customerStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-brand">
                Customer lifetime value
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-primary-foreground/80">
                Active Customers
              </CardTitle>
              <Award className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.activeCustomers}
              </div>
              <p className="text-[10px] text-brand">
                {customerStats.totalCustomers > 0
                  ? `${Math.round((customerStats.activeCustomers / customerStats.totalCustomers) * 100)}% active rate`
                  : "0% active"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-primary-foreground/80">
                Avg Order Value
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                ₹{customerStats.averageOrderValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-gold-text">Per customer</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-hover text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-card/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-xs font-medium text-primary-foreground/80">
                Total Orders
              </CardTitle>
              <Star className="h-4 w-4 text-primary-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold mb-1">
                {customerStats.totalOrders}
              </div>
              <p className="text-[10px] text-brand">Across all customers</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card/50 dark:bg-card/20 rounded-xl p-4 border border-border dark:border-border/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card dark:bg-card border-border dark:border-border"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
          <Sparkles className="h-4 w-4 text-gold" />
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
                  <div className="w-14 h-14 bg-muted dark:bg-card rounded-full shrink-0"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-muted dark:bg-card rounded w-48"></div>
                    <div className="h-3 bg-muted dark:bg-card rounded w-64"></div>
                    <div className="h-3 bg-muted dark:bg-card rounded w-32"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/40 bg-destructive/10 dark:bg-destructive/10 border-2">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive dark:text-destructive font-medium">
              Failed to load customers.
            </p>
            <p className="text-destructive/70 text-sm mt-1">
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
              <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card/80 dark:bg-card/40 backdrop-blur-sm border border-border dark:border-border/30 h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-gold/40 dark:ring-destructive/30 ring-offset-2 dark:ring-offset-footer">
                          <AvatarImage
                            src={customer.image}
                            alt={customer.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-brand-soft to-card dark:from-brand/30 dark:to-brand-hover/30 text-gold-text dark:text-gold font-bold text-lg">
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
                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-border dark:border-border",
                            customer.isActive ? "bg-success" : "bg-muted-foreground",
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-sans text-lg font-semibold text-foreground dark:text-primary-foreground group-hover:text-gold-text dark:group-hover:text-gold transition-colors">
                          {customer.name}
                        </h3>
                        <Badge
                          className={cn(
                            "mt-1 text-xs",
                            customer.isActive
                              ? "bg-success/10 text-success border-success/40 dark:bg-footer/20 dark:text-brand dark:border-success/60"
                              : "bg-muted text-muted-foreground border-border dark:bg-card dark:text-muted-foreground dark:border-border",
                          )}
                        >
                          {customer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 p-3 bg-muted dark:bg-card/40 rounded-xl">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground dark:text-muted-foreground truncate">
                        {customer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground dark:text-muted-foreground">
                        {customer.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground dark:text-muted-foreground">
                        Joined{" "}
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gradient-to-b from-brand-soft to-transparent dark:from-brand/10 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-brand mx-auto mb-1" />
                      <p className="text-lg font-bold text-brand dark:text-brand">
                        {customer.orderStats?.totalOrders || 0}
                      </p>
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        Orders
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-b from-brand-soft to-transparent dark:from-brand/10 rounded-lg">
                      <IndianRupee className="h-4 w-4 text-success mx-auto mb-1" />
                      <p className="text-lg font-bold text-success dark:text-brand">
                        ₹
                        {(
                          customer.orderStats?.totalSpent || 0
                        ).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        Spent
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-b from-brand-soft to-transparent dark:from-brand/10 rounded-lg">
                      <Star className="h-4 w-4 text-brand mx-auto mb-1" />
                      <p className="text-lg font-bold text-brand dark:text-brand">
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
                      <p className="text-[10px] text-muted-foreground dark:text-muted-foreground">
                        Days ago
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border dark:border-border/30">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-gold/15 border-gold/50 text-gold hover:text-gold-text dark:border-destructive/60 dark:hover:bg-destructive/20 transition-all duration-200"
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
        <Card className="border-dashed border-2 border-border dark:border-border bg-card/50 dark:bg-card/20">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-soft to-card dark:from-brand/20 dark:to-brand-hover/20 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-foreground dark:text-primary-foreground mb-2">
              {searchQuery ? "No customers found" : "No customers yet"}
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground max-w-md mx-auto">
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
