"use client";

import { useGetSiteSettingsQuery } from "@/services/siteSettingsApi";

/**
 * Custom hook to access site settings across frontend components.
 * Fetches from the API only once (cached by RTK Query).
 */
export function useSiteSettings() {
  const { data: settings, isLoading, isError } = useGetSiteSettingsQuery();

  return {
    settings: settings ?? null,
    isLoading,
    isError,
    // Convenience getters with fallbacks
    websiteName: settings?.websiteName || "Ink of Memories",
    websiteUrl: settings?.websiteUrl || "",
    email: settings?.email || "info@inkofmemories.com",
    mainOffice:
      settings?.mainOffice ||
      "123 Printing Street, Design District, Mumbai 400001",
    branchOffice: settings?.branchOffice || "",
    contactNo1: settings?.contactNo1 || "+91 98765 43210",
    contactNo2: settings?.contactNo2 || "",
    whatsAppNo: settings?.whatsAppNo || "+919034009062",
    logoUrl: settings?.logoUrl || "",
    bannerUrl: settings?.bannerUrl || "",
    favicon: settings?.favicon || "",
    facebook: settings?.facebook || "https://facebook.com/inkofmemories",
    instagram: settings?.instagram || "https://instagram.com/inkofmemories",
    twitter: settings?.twitter || "https://twitter.com/inkofmemories",
    linkedin:
      settings?.linkedin || "https://linkedin.com/company/inkofmemories",
    youtubeUrl: settings?.youtubeUrl || "",
    pinterest: settings?.pinterest || "",
    github: settings?.github || "",
  };
}
