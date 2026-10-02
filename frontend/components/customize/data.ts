import {
  Feather,
  ScrollText,
  Gem,
  Camera,
  PartyPopper,
  Crown,
  Flower2,
  Diamond,
  Infinity,
  Star,
  Sparkles,
  Heart,
} from "lucide-react";
import type {
  FontOption,
  ColorTheme,
  BorderStyle,
  CardTemplate,
  Step,
  PricingConfig,
} from "./types";

export const fonts: FontOption[] = [
  { name: "Playfair Display", class: "font-display", icon: Feather },
  { name: "DM Sans", class: "font-sans", icon: Feather },
  { name: "Elegant Script", class: "font-display italic", icon: Feather },
  { name: "Classic Serif", class: "font-serif", icon: Feather },
  { name: "Modern Sans", class: "font-sans font-light", icon: Feather },
];

export const colorThemes: ColorTheme[] = [
  {
    name: "Gold & Ivory",
    primary: "#C9A351",
    secondary: "#FFFBF0",
    accent: "#E8D5A3",
    description: "Timeless elegance",
  },
  {
    name: "Rose Gold",
    primary: "#B76E79",
    secondary: "#FFF0F3",
    accent: "#E8A0B0",
    description: "Romantic blush",
  },
  {
    name: "Silver & White",
    primary: "#8A8A8A",
    secondary: "#FFFFFF",
    accent: "#C0C0C0",
    description: "Modern minimal",
  },
  {
    name: "Burgundy & Gold",
    primary: "#722F37",
    secondary: "#FDF5E6",
    accent: "#C9A351",
    description: "Rich & regal",
  },
  {
    name: "Emerald Bliss",
    primary: "#2D6A4F",
    secondary: "#F0FFF4",
    accent: "#95D5B2",
    description: "Nature inspired",
  },
  {
    name: "Royal Sapphire",
    primary: "#1E3A8A",
    secondary: "#F0F9FF",
    accent: "#60A5FA",
    description: "Deep & bold",
  },
  {
    name: "Midnight Velvet",
    primary: "#2D1B69",
    secondary: "#F8F6FF",
    accent: "#9B59B6",
    description: "Luxurious depth",
  },
  {
    name: "Sunset Coral",
    primary: "#E86550",
    secondary: "#FFF8F7",
    accent: "#F5A09C",
    description: "Warm & vibrant",
  },
];

export const borderStyles: BorderStyle[] = [
  {
    name: "Classic Gold",
    pattern: "solid",
    icon: Crown,
    description: "Bold golden frame",
  },
  {
    name: "Floral Elegance",
    pattern: "floral",
    icon: Flower2,
    description: "Delicate blooms",
  },
  {
    name: "Geometric",
    pattern: "geometric",
    icon: Diamond,
    description: "Modern angles",
  },
  {
    name: "Minimalist",
    pattern: "minimal",
    icon: Infinity,
    description: "Clean lines",
  },
];

export const cardTemplates: CardTemplate[] = [
  {
    name: "Classic Invitation",
    preview: "classic",
    ornaments: ["corner-flourish", "center-accent"],
    description: "Traditional charm",
    icon: ScrollText,
  },
  {
    name: "Floral Romance",
    preview: "floral",
    ornaments: ["corner-flowers", "center-rose", "side-vine"],
    description: "Garden inspired",
    icon: Flower2,
  },
  {
    name: "Modern Geometric",
    preview: "geometric",
    ornaments: ["corner-diamond", "center-hexagon"],
    description: "Bold & contemporary",
    icon: Diamond,
  },
  {
    name: "Elegant Script",
    preview: "script",
    ornaments: ["corner-curls", "center-monogram"],
    description: "Refined calligraphy",
    icon: Feather,
  },
];

export const steps: Step[] = [
  {
    id: "details",
    label: "Details",
    icon: ScrollText,
    description: "Names & event info",
  },
  { id: "style", label: "Style", icon: Feather, description: "Font & colors" },
  {
    id: "design",
    label: "Design",
    icon: Gem,
    description: "Borders & templates",
  },
  {
    id: "media",
    label: "Media",
    icon: Camera,
    description: "Images & production",
  },
  {
    id: "preview",
    label: "Preview",
    icon: PartyPopper,
    description: "Final review",
  },
];

export const mockVenueSuggestions = [
  "The Grand Palace Ballroom",
  "Sunset Garden Estate",
  "Riverside Convention Center",
  "The Royal Oak Banquet Hall",
  "Oceanview Terrace",
  "Crystal Chapel & Gardens",
  "The Heritage Manor",
  "Starlight Pavilion",
  "Golden Tulip Resort",
  "The Vintage Barn",
  "Lakeside Wedding Venue",
  "The Rooftop Lounge",
];

// ─── NEW: Pricing Configuration ───
export const pricingConfig: PricingConfig = {
  basePrice: 500,
  tiers: [
    { minQty: 25, pricePerUnit: 18, label: "25 copies" },
    { minQty: 50, pricePerUnit: 14, label: "50 copies" },
    { minQty: 100, pricePerUnit: 11, label: "100 copies" },
    { minQty: 200, pricePerUnit: 8, label: "200 copies" },
  ],
  finishPremium: {
    matte: 0,
    gloss: 2,
    textured: 5,
  },
  productPremium: {
    invitation: 0,
    card: -2,
    photobook: 12,
  },
};

// ─── NEW: Quantity presets with labels ───
export const QTY_PRESETS = [
  { value: 25, label: "Intimate", icon: Heart },
  { value: 50, label: "Standard", icon: Heart },
  { value: 100, label: "Grand", icon: Star },
  { value: 200, label: "Extravagant", icon: Sparkles },
];
