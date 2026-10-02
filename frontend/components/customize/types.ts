import { type Feather, type Crown, type ScrollText } from "lucide-react";

export type FontOption = {
  name: string;
  class: string;
  icon: typeof Feather;
};

export type ColorTheme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
};

export type ValidationErrors = {
  [key: string]: string;
};

export type BorderStyle = {
  name: string;
  pattern: string;
  icon: typeof Crown;
  description: string;
};

export type CardTemplate = {
  name: string;
  preview: string;
  ornaments: string[];
  description: string;
  icon: typeof ScrollText;
};

export type StepKey = "details" | "style" | "design" | "media" | "preview";

export interface Step {
  id: StepKey;
  label: string;
  icon: typeof Feather;
  description: string;
}

export interface FormValues {
  groomName: string;
  brideName: string;
  eventDate: string;
  venue: string;
  message: string;
}

export interface CustomizePayload {
  groomName: string;
  brideName: string;
  eventDate: string;
  venue: string;
  message: string;
  selectedFont: string;
  selectedColor: { name: string; primary: string; secondary: string };
  selectedBorder: { name: string; pattern: string };
  selectedTemplate: { name: string; preview: string; ornaments: string[] };
  uploadedImages: string[];
}

// ─── NEW: Pricing Calculator ───
export interface PricingTier {
  minQty: number;
  pricePerUnit: number;
  label: string;
}

export interface PricingConfig {
  basePrice: number;
  tiers: PricingTier[];
  finishPremium: Record<string, number>;
  productPremium: Record<string, number>;
}