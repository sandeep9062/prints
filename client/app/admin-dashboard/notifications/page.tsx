"use client";

import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ShoppingCart,
  UserPlus,
  MessageSquare,
  AlertCircle,
  Mail,
  X,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useGetOrdersByUserQuery } from "@/services/ordersApi";
import { useGetContactsQuery } from "@/services/contactApi";
import { useGetAllCustomersQuery } from "@/services/userApi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Notification {
  id: string;
  type: "order" | "user" | "message" | "enquiry" | "alert";
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  icon: React.ElementType;
  color: string;
  link?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  order: {
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600",
    label: "Order",
  },
  user: { icon: UserPlus, color: "bg-green-100 text-green-600", label: "User" },
  message: {
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-600",
    label: "Message",
  },
  enquiry: {
    icon: Mail,
    color: "bg-orange-100 text-orange-600",
    label: "Enquiry",
  },
  alert: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-600",
    label: "Alert",
  },
};

// ---------------------------------------------------------------------------
// Notification Item Component
// ---------------------------------------------------------------------------
function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const Icon = notification.icon;

  return (
    <div
      className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
        !notification.read ? "bg-blue-50/60" : ""
      }`}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className={`p-2 rounded-full flex-shrink-0 ${notification.color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm truncate ${
              !notification.read
                ? "font-semibold text-gray-900"
                : "font-medium text-gray-700"
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {notification.time}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!notification.read && (
          <span className="h-2 w-2 rounded-full bg-blue-500" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all text-gray-400 hover:text-gray-600"
          title="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const NotificationsPage = () => {
  // ---- API hooks ----
  const { data: ordersResp, isLoading: ordersLoading } =
    useGetOrdersByUserQuery();
  const { data: contactsResp, isLoading: contactsLoading } =
    useGetContactsQuery();
  const { data: customersResp, isLoading: customersLoading } =
    useGetAllCustomersQuery();

  // ---- Local state ----
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  const isLoading = ordersLoading || contactsLoading || customersLoading;

  // ---- Normalize data ----
  const orderList: any[] = useMemo(() => {
    if (!ordersResp) return [];
    if (Array.isArray(ordersResp)) return ordersResp;
    if (Array.isArray((ordersResp as any).orders))
      return (ordersResp as any).orders;
    return [];
  }, [ordersResp]);

  const contactList: any[] = useMemo(() => {
    if (!contactsResp) return [];
    if (Array.isArray(contactsResp)) return contactsResp;
    if (Array.isArray((contactsResp as any).contacts))
      return (contactsResp as any).contacts;
    return [];
  }, [contactsResp]);

  const customerList: any[] = useMemo(() => {
    if (!customersResp) return [];
    if (Array.isArray(customersResp)) return customersResp;
    return [];
  }, [customersResp]);

  // ---- Build unified notification feed ----
  const allNotifications: Notification[] = useMemo(() => {
    const notifications: Notification[] = [];
    const now = Date.now();

    // 1. New orders (alerts for pending orders, new deliveries)
    orderList.forEach((order: any) => {
      const date = order.createdAt ? new Date(order.createdAt) : new Date();
      const ts = date.getTime();

      // If order is recent (within last 7 days), show as notification
      if (now - ts < 7 * 24 * 60 * 60 * 1000) {
        const orderStatus = order.orderStatus?.toLowerCase() || "pending";
        const orderId = order._id?.slice(-8).toUpperCase() || "N/A";

        if (orderStatus === "pending") {
          notifications.push({
            id: `order-pending-${order._id}`,
            type: "order",
            title: "New Order Received",
            message: `Order #${orderId} has been placed by ${order.user?.name || "Guest"}`,
            time: timeAgo(date),
            timestamp: date,
            read: false,
            icon: ShoppingCart,
            color: typeConfig.order.color,
            link: "/admin-dashboard/orders",
          });
        } else if (orderStatus === "delivered") {
          notifications.push({
            id: `order-delivered-${order._id}`,
            type: "order",
            title: "Order Delivered",
            message: `Order #${orderId} has been marked as delivered`,
            time: timeAgo(date),
            timestamp: date,
            read: false,
            icon: Check,
            color: "bg-green-100 text-green-600",
            link: "/admin-dashboard/orders",
          });
        } else if (orderStatus === "cancelled") {
          notifications.push({
            id: `order-cancelled-${order._id}`,
            type: "alert",
            title: "Order Cancelled",
            message: `Order #${orderId} has been cancelled`,
            time: timeAgo(date),
            timestamp: date,
            read: false,
            icon: AlertCircle,
            color: "bg-red-100 text-red-600",
            link: "/admin-dashboard/orders",
          });
        }
      }
    });

    // 2. Contact form submissions
    contactList.forEach((contact: any) => {
      const date = contact.createdAt ? new Date(contact.createdAt) : new Date();
      notifications.push({
        id: `contact-${contact._id || contact.id}`,
        type: "message",
        title: "New Contact Form Submission",
        message: `${contact.name || contact.fullName || "Someone"} sent a message: "${(contact.message || contact.description || "").slice(0, 100)}"`,
        time: timeAgo(date),
        timestamp: date,
        read: false,
        icon: MessageSquare,
        color: typeConfig.message.color,
        link: "/admin-dashboard/contacts",
      });
    });

    // 3. New customer registrations
    customerList.forEach((customer: any) => {
      const date = customer.createdAt
        ? new Date(customer.createdAt)
        : new Date();
      const ts = date.getTime();
      // Only recent registrations (within last 7 days)
      if (now - ts < 7 * 24 * 60 * 60 * 1000) {
        notifications.push({
          id: `user-${customer._id || customer.id}`,
          type: "user",
          title: "New User Registered",
          message: `${customer.name || "Someone"} has created a new account (${customer.email || ""})`,
          time: timeAgo(date),
          timestamp: date,
          read: false,
          icon: UserPlus,
          color: typeConfig.user.color,
          link: "/admin-dashboard/users",
        });
      }
    });

    // Sort by timestamp descending (newest first)
    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return notifications;
  }, [orderList, contactList, customerList]);

  // ---- Filtered & read/dismiss state ----
  const notifications = useMemo(() => {
    return allNotifications.filter((n) => !dismissedIds.has(n.id));
  }, [allNotifications, dismissedIds]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !readIds.has(n.id));
      case "orders":
        return notifications.filter((n) => n.type === "order");
      case "users":
        return notifications.filter((n) => n.type === "user");
      case "alerts":
        return notifications.filter((n) => n.type === "alert");
      default:
        return notifications;
    }
  }, [notifications, activeTab, readIds]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  // ---- Actions ----
  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const allIds = notifications.map((n) => n.id);
    setReadIds((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => next.add(id));
      return next;
    });
    setMarkingAll(false);
    toast({
      title: "All marked as read",
      description: `${allIds.length} notification${allIds.length !== 1 ? "s" : ""} marked`,
    });
  };

  const handleMarkRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleRefresh = () => {
    window.location.reload();
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
        <Skeleton className="h-10 w-[500px]" />
        <Card>
          <CardContent className="p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 flex items-start gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and view all system notifications, alerts and updates
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            {markingAll ? "Marking..." : "Mark All Read"}
          </Button>
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ==================== SUMMARY CARD ==================== */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-white border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {notifications.length} total · {readIds.size} read ·{" "}
                  {dismissedIds.size} dismissed
                </p>
              </div>
            </div>
            <Badge
              variant={unreadCount > 0 ? "default" : "secondary"}
              className={unreadCount > 0 ? "bg-blue-500" : ""}
            >
              {unreadCount > 0 ? `${unreadCount} new` : "None"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ==================== TABS ==================== */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-8">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({notifications.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 text-xs text-white bg-blue-500 rounded-full px-1.5">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders">
            Orders
            <span className="ml-1.5 text-xs text-gray-400">
              ({notifications.filter((n) => n.type === "order").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
            <span className="ml-1.5 text-xs text-gray-400">
              ({notifications.filter((n) => n.type === "user").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            <span className="ml-1.5 text-xs text-gray-400">
              ({notifications.filter((n) => n.type === "alert").length})
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ---- Shared notification list for all tabs ---- */}
        {["all", "unread", "orders", "users", "alerts"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    {tab === "unread" ? (
                      <>
                        <Check className="h-12 w-12 text-green-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          All Caught Up
                        </h3>
                        <p className="text-sm text-gray-400 text-center max-w-sm">
                          You have no unread notifications. New notifications
                          will appear here when something happens.
                        </p>
                      </>
                    ) : tab === "orders" ? (
                      <>
                        <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No Order Notifications
                        </h3>
                        <p className="text-sm text-gray-400 text-center max-w-sm">
                          Order-related notifications will appear here when
                          customers place or update orders.
                        </p>
                      </>
                    ) : tab === "users" ? (
                      <>
                        <UserPlus className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No User Notifications
                        </h3>
                        <p className="text-sm text-gray-400 text-center max-w-sm">
                          New user registration alerts will appear here.
                        </p>
                      </>
                    ) : tab === "alerts" ? (
                      <>
                        <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No Alerts
                        </h3>
                        <p className="text-sm text-gray-400 text-center max-w-sm">
                          Important alerts about cancellations or failed
                          payments will appear here.
                        </p>
                      </>
                    ) : (
                      <>
                        <Bell className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-1">
                          No Notifications Yet
                        </h3>
                        <p className="text-sm text-gray-400 text-center max-w-sm">
                          When something happens — new orders, user
                          registrations, contact form submissions — you'll see
                          it here.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={{
                          ...notification,
                          read: readIds.has(notification.id),
                        }}
                        onMarkRead={handleMarkRead}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer with count */}
            {filteredNotifications.length > 0 && (
              <div className="flex items-center justify-between mt-4 px-1">
                <p className="text-xs text-gray-400">
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400"
                  onClick={() => {
                    setReadIds(new Set());
                    setDismissedIds(new Set());
                  }}
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
