"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Save,
  Bell,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Loader2,
  AlertCircle,
  RefreshCw,
  Image,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  useGetSiteSettingsQuery,
  useCreateSiteSettingsMutation,
  useUpdateSiteSettingsMutation,
  type SiteSettings,
} from "@/services/siteSettingsApi";

// ---------------------------------------------------------------------------
// Default empty settings
// ---------------------------------------------------------------------------
const EMPTY_SETTINGS: SiteSettings = {
  websiteName: "",
  websiteUrl: "",
  email: "",
  mainOffice: "",
  branchOffice: "",
  googleMapUrl: "",
  contactNo1: "",
  contactNo2: "",
  whatsAppNo: "",
  GSTNO: "",
  accountName: "",
  accountNumber: "",
  IFSCcode: "",
  branch: "",
  logoUrl: "",
  bannerUrl: "",
  favicon: "",
  language: "",
  country: "",
  linkedin: "",
  pinterest: "",
  twitter: "",
  github: "",
  facebook: "",
  instagram: "",
  youtubeUrl: "",
};

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  // ---- API hooks ----
  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSiteSettingsQuery();
  const [createSettings, { isLoading: isCreating }] =
    useCreateSiteSettingsMutation();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSiteSettingsMutation();

  const isSaving = isCreating || isUpdating;

  // ---- Local form state ----
  const [form, setForm] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync API data → form
  useEffect(() => {
    if (settings && settings._id) {
      setForm({ ...EMPTY_SETTINGS, ...settings });
    } else {
      setForm(EMPTY_SETTINGS);
    }
  }, [settings]);

  // ---- Field change handler ----
  const handleChange = useCallback(
    (field: keyof SiteSettings, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setHasChanges(true);
    },
    [],
  );

  // ---- Save handler ----
  const handleSave = async () => {
    try {
      if (settings?._id) {
        // UPDATE existing
        await updateSettings({ id: settings._id, body: form }).unwrap();
        toast({
          title: "Settings saved",
          description: "Site settings have been updated successfully.",
        });
      } else {
        // CREATE new
        await createSettings(form).unwrap();
        toast({
          title: "Settings created",
          description: "Site settings have been created successfully.",
        });
      }
      setHasChanges(false);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message?: string } }).data?.message
          : "Failed to save settings";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
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
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-10 w-[600px]" />
        <Card>
          <CardContent className="p-6 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
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
        : "Failed to load settings";
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Failed to Load Settings
        </h2>
        <p className="text-gray-500 mb-6 max-w-md text-center">{errMsg}</p>
        <Button onClick={refetch} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const isNew = !settings?._id;

  return (
    <div>
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Configure system settings, preferences and manage site configuration
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isSaving}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || (!hasChanges && !isNew)}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Settings" : "Save Changes"}
              </>
            )}
          </Button>
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ==================== TABS ==================== */}
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
        </TabsList>

        {/* ---- General Tab ---- */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic site configuration and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="websiteName">Website Name</Label>
                  <Input
                    id="websiteName"
                    value={form.websiteName || ""}
                    onChange={(e) =>
                      handleChange("websiteName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    value={form.websiteUrl || ""}
                    onChange={(e) => handleChange("websiteUrl", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Site Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={form.language || ""}
                    onChange={(e) => handleChange("language", e.target.value)}
                    placeholder="e.g. English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="e.g. India"
                  />
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mainOffice">Main Office Address</Label>
                  <Textarea
                    id="mainOffice"
                    value={form.mainOffice || ""}
                    onChange={(e) => handleChange("mainOffice", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchOffice">Branch Office Address</Label>
                  <Textarea
                    id="branchOffice"
                    value={form.branchOffice || ""}
                    onChange={(e) =>
                      handleChange("branchOffice", e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNo1">Primary Contact No.</Label>
                  <Input
                    id="contactNo1"
                    value={form.contactNo1 || ""}
                    onChange={(e) => handleChange("contactNo1", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNo2">Secondary Contact No.</Label>
                  <Input
                    id="contactNo2"
                    value={form.contactNo2 || ""}
                    onChange={(e) => handleChange("contactNo2", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsAppNo">WhatsApp Number</Label>
                  <Input
                    id="whatsAppNo"
                    value={form.whatsAppNo || ""}
                    onChange={(e) => handleChange("whatsAppNo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GSTNO">GST Number</Label>
                  <Input
                    id="GSTNO"
                    value={form.GSTNO || ""}
                    onChange={(e) => handleChange("GSTNO", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Map</h3>
              <div className="space-y-2">
                <Label htmlFor="googleMapUrl">Google Map Embed URL</Label>
                <Input
                  id="googleMapUrl"
                  value={form.googleMapUrl || ""}
                  onChange={(e) => handleChange("googleMapUrl", e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Branding Tab ---- */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>
                Upload logos, favicon and configure visual settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo */}
                <div className="space-y-3">
                  <Label>Logo</Label>
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed rounded-lg bg-gray-50">
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt="Logo"
                        className="h-20 object-contain"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="w-full space-y-2">
                      <Label
                        htmlFor="logoUrl"
                        className="text-xs text-gray-500"
                      >
                        Logo URL
                      </Label>
                      <Input
                        id="logoUrl"
                        value={form.logoUrl || ""}
                        onChange={(e) =>
                          handleChange("logoUrl", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="space-y-3">
                  <Label>Banner Image</Label>
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed rounded-lg bg-gray-50">
                    {form.bannerUrl ? (
                      <img
                        src={form.bannerUrl}
                        alt="Banner"
                        className="h-20 w-full object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-full rounded bg-gray-200 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="w-full space-y-2">
                      <Label
                        htmlFor="bannerUrl"
                        className="text-xs text-gray-500"
                      >
                        Banner URL
                      </Label>
                      <Input
                        id="bannerUrl"
                        value={form.bannerUrl || ""}
                        onChange={(e) =>
                          handleChange("bannerUrl", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-3">
                  <Label>Favicon</Label>
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed rounded-lg bg-gray-50">
                    {form.favicon ? (
                      <img
                        src={form.favicon}
                        alt="Favicon"
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="w-full space-y-2">
                      <Label
                        htmlFor="favicon"
                        className="text-xs text-gray-500"
                      >
                        Favicon URL
                      </Label>
                      <Input
                        id="favicon"
                        value={form.favicon || ""}
                        onChange={(e) =>
                          handleChange("favicon", e.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Notifications Tab ---- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and push notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive email when new order is placed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New User Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Notify when new user registers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Alert on successful and failed payments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Contact Form Submissions</Label>
                    <p className="text-sm text-gray-500">
                      Get notified for contact form entries
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Payment Tab ---- */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment & Bank Details</CardTitle>
              <CardDescription>
                Configure bank account details for payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={form.accountName || ""}
                    onChange={(e) =>
                      handleChange("accountName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={form.accountNumber || ""}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="IFSCcode">IFSC Code</Label>
                  <Input
                    id="IFSCcode"
                    value={form.IFSCcode || ""}
                    onChange={(e) => handleChange("IFSCcode", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Bank Branch</Label>
                  <Input
                    id="branch"
                    value={form.branch || ""}
                    onChange={(e) => handleChange("branch", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Gateways</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cash on Delivery</Label>
                    <p className="text-sm text-gray-500">
                      Allow cash on delivery option
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Social Tab ---- */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Configure your social media profile URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={form.facebook || ""}
                    onChange={(e) => handleChange("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={form.instagram || ""}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    value={form.twitter || ""}
                    onChange={(e) => handleChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={form.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    value={form.youtubeUrl || ""}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinterest">Pinterest</Label>
                  <Input
                    id="pinterest"
                    value={form.pinterest || ""}
                    onChange={(e) => handleChange("pinterest", e.target.value)}
                    placeholder="https://pinterest.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={form.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Email Tab ---- */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                View system email settings (SMTP configured server-side)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Site Email Address</Label>
                  <Input
                    value={form.email || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-400">
                    This is the email configured in General settings
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Website Name</Label>
                  <Input
                    value={form.websiteName || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-400">
                    Used as sender name in emails
                  </p>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">SMTP Configuration</p>
                <p>
                  SMTP credentials are configured on the server side via
                  environment variables. Contact your server administrator to
                  update SMTP settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---- Unsaved changes indicator ---- */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6">
          <Button
            variant="default"
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Unsaved Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
