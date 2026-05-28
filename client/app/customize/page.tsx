"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Heart,
  ChevronLeft,
  Loader2,
  Save,
  Download,
  Share2,
  Trash2,
  Clock,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Ruler,
  FileImage,
  Lightbulb,
  Keyboard,
  DollarSign,
  PartyPopper,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateCustomizationMutation,
  useUploadCustomizationImagesMutation,
  useGetMyCustomizationsQuery,
  useDeleteCustomizationMutation,
} from "@/services/customizationApi";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import { motion, AnimatePresence } from "framer-motion";
import { type Product, type Finish } from "@/components/DesignCanvas";

import CustomizeHeader from "@/components/customize/CustomizeHeader";
import StepProgress from "@/components/customize/StepProgress";
import DetailsStep from "@/components/customize/DetailsStep";
import StyleStep from "@/components/customize/StyleStep";
import DesignStep from "@/components/customize/DesignStep";
import MediaStep from "@/components/customize/MediaStep";
import PreviewStep from "@/components/customize/PreviewStep";
import LivePreview from "@/components/customize/LivePreview";
import {
  fonts,
  colorThemes,
  borderStyles,
  cardTemplates,
  steps,
  pricingConfig,
} from "@/components/customize/data";
import type {
  FontOption,
  ColorTheme,
  BorderStyle,
  CardTemplate,
  ValidationErrors,
} from "@/components/customize/types";

// ─── localStorage autosave key ───
const AUTOSAVE_KEY = "ink_elegance_customize_draft";

// ─── Deterministic floating particle positions (avoids hydration mismatch from Math.random) ───
const PARTICLE_POSITIONS = [
  { left: 22, delay: 0.5, duration: 14.2 },
  { left: 45, delay: 2.1, duration: 16.8 },
  { left: 68, delay: 3.8, duration: 12.5 },
  { left: 33, delay: 5.3, duration: 15.1 },
  { left: 76, delay: 0.9, duration: 17.3 },
  { left: 51, delay: 7.2, duration: 13.7 },
  { left: 15, delay: 4.6, duration: 16.2 },
  { left: 82, delay: 6.7, duration: 14.9 },
  { left: 38, delay: 1.8, duration: 12.8 },
  { left: 60, delay: 8.4, duration: 15.6 },
];

// ─── Confetti helper ───
function fireConfetti() {
  const colors = [
    "#C9A351",
    "#FFD700",
    "#FF6B6B",
    "#48DBFB",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#FFE66D",
  ];
  const container = document.body;
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${10 + Math.random() * 80}%`;
    piece.style.top = `${-5 - Math.random() * 10}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${4 + Math.random() * 8}px`;
    piece.style.height = `${4 + Math.random() * 8}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = `${1 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
}

// ─── Ripple effect helper ───
function createRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const button = e.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.style.position = "absolute";
  circle.style.borderRadius = "50%";
  circle.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  circle.style.transform = "scale(0)";
  circle.style.animation = "ripple 0.6s linear";
  circle.style.pointerEvents = "none";
  button.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

// ─── Error Boundary Component ───
class CustomizeErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 flex items-center justify-center p-8">
          <div className="card-elegant p-8 max-w-lg text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="font-display text-2xl font-semibold">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ||
                "An unexpected error occurred in the customization studio."}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Studio
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Paper size specs overlay ───
const PAPER_SPECS = [
  { label: "Size", value: '5" × 7" (A7)' },
  { label: "Paper", value: "300gsm Premium Matte" },
  { label: "Finish", value: "Matte / Gloss / Textured" },
  { label: "Print", value: "Full-color CMYK + Foil" },
  { label: "Packaging", value: "Premium box with tissue" },
];

function PrintSpecsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-2xl ring-1 ring-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Ruler className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">
            Print Specifications
          </h3>
        </div>
        <div className="space-y-3">
          {PAPER_SPECS.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between items-center text-sm border-b border-border/40 pb-2 last:border-0"
            >
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        <Button onClick={onClose} variant="elegant" className="w-full mt-6">
          Got it
        </Button>
      </motion.div>
    </div>
  );
}

// ─── Keyboard shortcuts modal ───
function KeyboardShortcutsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const shortcuts = [
    { keys: "Ctrl + Enter", action: "Next step" },
    { keys: "Ctrl + Backspace", action: "Previous step" },
    { keys: "Ctrl + S", action: "Save draft" },
    { keys: "Ctrl + Shift + S", action: "Submit design" },
    { keys: "Ctrl + R", action: "Reset form" },
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-2xl ring-1 ring-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Keyboard className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">
            Keyboard Shortcuts
          </h3>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-muted-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-secondary rounded-md text-xs font-mono">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
        <Button onClick={onClose} variant="elegant" className="w-full mt-6">
          Got it
        </Button>
      </motion.div>
    </div>
  );
}

// ─── My Customizations Panel ───
function MyCustomizationsPanel({
  onLoadDraft,
}: {
  onLoadDraft: (data: any) => void;
}) {
  const { data, isLoading, error } = useGetMyCustomizationsQuery(undefined, {
    skip:
      typeof window !== "undefined" && !localStorage.getItem("token")
        ? true
        : false,
  });
  const [deleteCustomization] = useDeleteCustomizationMutation();

  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading saved designs...
      </div>
    );
  }

  if (error || !data?.data?.length) {
    return null;
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomization(id).unwrap();
      toast.success("Design deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elegant p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4 text-primary" />
        My Saved Designs ({data.count})
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {data.data.map((item: any) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {item.groomName} & {item.brideName}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onLoadDraft(item)}
                className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                title="Load design"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                title="Delete design"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Pricing Calculator Component ───
function PricingCalculator({
  canvasQty,
  canvasFinish,
  canvasProduct,
}: {
  canvasQty: number;
  canvasFinish: Finish;
  canvasProduct: Product;
}) {
  // Find the matching tier
  const tier = [...pricingConfig.tiers]
    .reverse()
    .find((t) => canvasQty >= t.minQty);
  const pricePerUnit =
    tier?.pricePerUnit || pricingConfig.tiers[0].pricePerUnit;
  const finishPremium = pricingConfig.finishPremium[canvasFinish] || 0;
  const productPremium = pricingConfig.productPremium[canvasProduct] || 0;
  const effectivePrice = pricePerUnit + finishPremium + productPremium;
  const total = effectivePrice * canvasQty + pricingConfig.basePrice;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/10 space-y-3"
    >
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Price Breakdown</span>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Base price</span>
          <span>₹{pricingConfig.basePrice}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            Per unit ({canvasQty} × ₹{effectivePrice})
          </span>
          <span>₹{effectivePrice * canvasQty}</span>
        </div>
        {finishPremium > 0 && (
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>Finish premium ({canvasFinish})</span>
            <span>+₹{finishPremium}/unit</span>
          </div>
        )}
        {productPremium !== 0 && (
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>Product adjustment ({canvasProduct})</span>
            <span>
              {productPremium > 0
                ? `+₹${productPremium}`
                : `₹${productPremium}`}
              /unit
            </span>
          </div>
        )}
        <div className="border-t border-primary/20 pt-2 flex justify-between font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Total
          </span>
          <span className="text-primary text-lg">
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page Component ───
const Page = () => {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Customize", url: "/customize" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    eventDate: "",
    venue: "",
    message: "",
  });

  const [selectedFont, setSelectedFont] = useState<FontOption>(fonts[0]);
  const [selectedColor, setSelectedColor] = useState<ColorTheme>(
    colorThemes[0],
  );
  const [selectedBorder, setSelectedBorder] = useState<BorderStyle>(
    borderStyles[0],
  );
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(
    cardTemplates[0],
  );

  const [canvasProduct, setCanvasProduct] = useState<Product>("invitation");
  const [canvasFinish, setCanvasFinish] = useState<Finish>("matte");
  const [canvasQty, setCanvasQty] = useState(50);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAutosaveRestore, setShowAutosaveRestore] = useState(false);
  const [savedDraft, setSavedDraft] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [createCustomization] = useCreateCustomizationMutation();
  const [uploadImages] = useUploadCustomizationImagesMutation();

  const currentStep = steps[currentStepIdx];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === steps.length - 1;
  const progressPercent = ((currentStepIdx + 1) / steps.length) * 100;

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "Enter") {
        e.preventDefault();
        if (!isLastStep) handleNext();
        else handleSubmit(e as unknown as FormEvent);
      }
      if (ctrl && e.key === "Backspace") {
        e.preventDefault();
        if (!isFirstStep) handlePrev();
      }
      if (ctrl && e.key === "s") {
        e.preventDefault();
        autosave();
        toast.success("Draft saved!");
      }
      if (ctrl && e.shiftKey && e.key === "S") {
        e.preventDefault();
        if (isLastStep) handleSubmit(e as unknown as FormEvent);
        else {
          setCurrentStepIdx(steps.length - 1);
          toast.info("Jumped to preview");
        }
      }
      if (ctrl && e.key === "r" && e.shiftKey) {
        e.preventDefault();
        handleReset();
      }
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isFirstStep,
    isLastStep,
    currentStepIdx,
    formData,
    selectedFont,
    selectedColor,
    selectedBorder,
    selectedTemplate,
    canvasProduct,
    canvasFinish,
    canvasQty,
    previews,
  ]);

  // ─── Autosave to localStorage ───
  const autosave = useCallback(() => {
    try {
      const draft = {
        formData,
        selectedFont: selectedFont.name,
        selectedColor: selectedColor.name,
        selectedBorder: selectedBorder.name,
        selectedTemplate: selectedTemplate.name,
        canvasProduct,
        canvasFinish,
        canvasQty,
        previews,
        currentStepIdx,
        savedAt: Date.now(),
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
    } catch {
      // Silently fail
    }
  }, [
    formData,
    selectedFont,
    selectedColor,
    selectedBorder,
    selectedTemplate,
    canvasProduct,
    canvasFinish,
    canvasQty,
    previews,
    currentStepIdx,
  ]);

  // Autosave every 30 seconds when there's data
  useEffect(() => {
    const hasData =
      formData.groomName ||
      formData.brideName ||
      formData.eventDate ||
      formData.venue;
    if (!hasData) return;
    const interval = setInterval(autosave, 30000);
    return () => clearInterval(interval);
  }, [autosave]);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.formData?.groomName || draft.formData?.brideName) {
          setSavedDraft(draft);
          setShowAutosaveRestore(true);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const restoreDraft = () => {
    if (!savedDraft) return;
    const d = savedDraft;
    setFormData(d.formData);
    if (d.selectedFont) {
      const f = fonts.find((x) => x.name === d.selectedFont);
      if (f) setSelectedFont(f);
    }
    if (d.selectedColor) {
      const c = colorThemes.find((x) => x.name === d.selectedColor);
      if (c) setSelectedColor(c);
    }
    if (d.selectedBorder) {
      const b = borderStyles.find((x) => x.name === d.selectedBorder);
      if (b) setSelectedBorder(b);
    }
    if (d.selectedTemplate) {
      const t = cardTemplates.find((x) => x.name === d.selectedTemplate);
      if (t) setSelectedTemplate(t);
    }
    if (d.previewUrls) setPreviews(d.previewUrls);
    if (d.currentStepIdx !== undefined) setCurrentStepIdx(d.currentStepIdx);
    setShowAutosaveRestore(false);
    toast.success("Draft restored successfully!");
  };

  const discardDraft = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setSavedDraft(null);
    setShowAutosaveRestore(false);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.groomName.trim())
      errors.groomName = "Groom's name is required";
    if (!formData.brideName.trim())
      errors.brideName = "Bride's name is required";
    if (!formData.eventDate) errors.eventDate = "Event date is required";
    if (!formData.venue.trim()) errors.venue = "Venue is required";
    if (formData.eventDate) {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today)
        errors.eventDate = "Event date must be in the future";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceed = (): boolean => {
    if (currentStep.id === "details") return validateForm();
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please fix the validation errors first");
      return;
    }
    if (!isLastStep) setCurrentStepIdx((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStepIdx((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (idx: number) => {
    if (idx < currentStepIdx || canProceed()) {
      setCurrentStepIdx(idx);
    }
  };

  const isStepComplete = (stepIdx: number): boolean => {
    if (stepIdx === 0) {
      return !!(
        formData.groomName.trim() &&
        formData.brideName.trim() &&
        formData.eventDate &&
        formData.venue.trim()
      );
    }
    return true;
  };

  // ─── Image Upload (Backend via FormData) ───
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && validFiles.length < 5) {
        validFiles.push(file);
      }
    });

    if (files.length > 5) toast.warning("Maximum 5 images allowed");

    // Show local previews immediately
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newPreviews.push(ev.target.result as string);
          if (newPreviews.length === validFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Share Draft Link ───
  const handleShareDraft = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Wedding Invitation Design",
          text: `Check out my invitation design for ${formData.groomName || "Groom"} & ${formData.brideName || "Bride"} on Ink Elegance!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Could not copy link");
        });
    }
  };

  // ─── Download Preview as Image ───
  const handleDownloadPreview = () => {
    const previewEl = document.getElementById("live-preview-card");
    if (!previewEl) {
      toast.error("Preview not available");
      return;
    }
    toast.info(
      "Right-click on the preview card and save it as an image, or take a screenshot.",
    );
  };

  // ─── Load draft from saved designs ───
  const handleLoadDraft = (item: any) => {
    setFormData({
      groomName: item.groomName || "",
      brideName: item.brideName || "",
      eventDate: item.eventDate
        ? new Date(item.eventDate).toISOString().split("T")[0]
        : "",
      venue: item.venue || "",
      message: item.message || "",
    });
    if (item.selectedFont) {
      const f = fonts.find((x) => x.name === item.selectedFont);
      if (f) setSelectedFont(f);
    }
    if (item.selectedColor?.name) {
      const c = colorThemes.find((x) => x.name === item.selectedColor.name);
      if (c) setSelectedColor(c);
    }
    if (item.selectedBorder?.name) {
      const b = borderStyles.find((x) => x.name === item.selectedBorder.name);
      if (b) setSelectedBorder(b);
    }
    if (item.selectedTemplate?.name) {
      const t = cardTemplates.find(
        (x) => x.name === item.selectedTemplate.name,
      );
      if (t) setSelectedTemplate(t);
    }
    if (item.uploadedImages?.length) {
      setPreviews(item.uploadedImages);
    }
    setCurrentStepIdx(4); // Go to preview
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Design loaded successfully!");
  };

  // ─── Submit ───
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload images to backend if we have files
      let finalImageUrls: string[] = [...previews];
      if (uploadedImages.length > 0) {
        try {
          const formData = new FormData();
          uploadedImages.forEach((file) => formData.append("images", file));
          const uploadRes = await uploadImages(formData).unwrap();
          if (uploadRes.success && uploadRes.data?.length) {
            finalImageUrls = uploadRes.data;
          }
        } catch {
          // Continue with local previews if upload fails
          console.warn("Image upload failed, using local previews");
        }
      }

      const payload = {
        groomName: formData.groomName.trim(),
        brideName: formData.brideName.trim(),
        eventDate: formData.eventDate,
        venue: formData.venue.trim(),
        message: formData.message.trim(),
        selectedFont: selectedFont.name,
        selectedColor: {
          name: selectedColor.name,
          primary: selectedColor.primary,
          secondary: selectedColor.secondary,
        },
        selectedBorder: {
          name: selectedBorder.name,
          pattern: selectedBorder.pattern,
        },
        selectedTemplate: {
          name: selectedTemplate.name,
          preview: selectedTemplate.preview,
          ornaments: selectedTemplate.ornaments,
        },
        uploadedImages: finalImageUrls,
      };
      await createCustomization(payload).unwrap();
      // Clear autosave on success
      localStorage.removeItem(AUTOSAVE_KEY);
      setIsSuccess(true);

      // Fire confetti!
      fireConfetti();
      setShowConfetti(true);

      toast.success("🎉 Customization saved successfully!");
      setTimeout(() => {
        setFormData({
          groomName: "",
          brideName: "",
          eventDate: "",
          venue: "",
          message: "",
        });
        setSelectedFont(fonts[0]);
        setSelectedColor(colorThemes[0]);
        setSelectedBorder(borderStyles[0]);
        setSelectedTemplate(cardTemplates[0]);
        setUploadedImages([]);
        setPreviews([]);
        setIsSuccess(false);
        setShowConfetti(false);
        setCurrentStepIdx(0);
      }, 4000);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to save customization. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Reset ───
  const handleReset = () => {
    setFormData({
      groomName: "",
      brideName: "",
      eventDate: "",
      venue: "",
      message: "",
    });
    setSelectedFont(fonts[0]);
    setSelectedColor(colorThemes[0]);
    setSelectedBorder(borderStyles[0]);
    setSelectedTemplate(cardTemplates[0]);
    setUploadedImages([]);
    setPreviews([]);
    setValidationErrors({});
    setCurrentStepIdx(0);
    localStorage.removeItem(AUTOSAVE_KEY);
    setSavedDraft(null);
    setShowAutosaveRestore(false);
    toast.success("Form reset successfully");
  };

  // ─── Render current step ───
  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case "details":
        return (
          <DetailsStep
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
          />
        );
      case "style":
        return (
          <StyleStep
            fonts={fonts}
            colorThemes={colorThemes}
            selectedFont={selectedFont}
            selectedColor={selectedColor}
            onFontChange={setSelectedFont}
            onColorChange={setSelectedColor}
          />
        );
      case "design":
        return (
          <DesignStep
            borderStyles={borderStyles}
            cardTemplates={cardTemplates}
            selectedBorder={selectedBorder}
            selectedTemplate={selectedTemplate}
            selectedColor={selectedColor}
            onBorderChange={setSelectedBorder}
            onTemplateChange={setSelectedTemplate}
          />
        );
      case "media":
        return (
          <MediaStep
            previews={previews}
            uploadedCount={uploadedImages.length}
            fileInputRef={
              fileInputRef as React.RefObject<HTMLInputElement | null>
            }
            onFileUpload={handleFileUpload}
            onRemoveImage={removeImage}
            onProductChange={setCanvasProduct}
            onFinishChange={setCanvasFinish}
            onQuantityChange={setCanvasQty}
            onImageChange={setCanvasImage}
          />
        );
      case "preview":
        return (
          <PreviewStep
            selectedFont={selectedFont}
            selectedColor={selectedColor}
            selectedBorder={selectedBorder}
            selectedTemplate={selectedTemplate}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CustomizeErrorBoundary onReset={handleReset}>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
        <SEOHelper
          title="Customize Your Wedding Invitation – Design Online | Ink of Memories"
          description="Design your own wedding invitation card online. Choose fonts, colors, borders, and templates. Premium quality printing by Samlason Printing Press, Panchkula."
          path="/customize"
          image="https://inkofmemories.com/inkofmemories.png"
          keywords="customize wedding invitation, design invitation online, wedding card designer, custom invitation card, personalized wedding cards"
          jsonLd={breadcrumbSchema}
        />
        {/* Keyboard shortcut hint (bottom-left fixed) */}
        <button
          onClick={() => setShowShortcuts(true)}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Autosave Restore Prompt */}
        <AnimatePresence>
          {showAutosaveRestore && savedDraft && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="bg-background border border-primary/20 rounded-2xl p-4 shadow-2xl shadow-primary/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Save className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    Unfinished draft found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saved{" "}
                    {savedDraft.savedAt
                      ? new Date(savedDraft.savedAt).toLocaleString()
                      : "recently"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="elegant" onClick={discardDraft}>
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={restoreDraft}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Restore
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {isSuccess && showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background rounded-2xl p-8 max-w-sm text-center shadow-2xl border border-primary/20"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <PartyPopper className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Design Created! 🎉
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your personalized invitation has been saved. What would you
                  like to do next?
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="elegant"
                    onClick={() => {
                      setIsSuccess(false);
                      setShowConfetti(false);
                    }}
                  >
                    Create Another
                  </Button>
                  <Button
                    className="bg-primary text-white"
                    onClick={() => {
                      setIsSuccess(false);
                      setShowConfetti(false);
                      window.location.href = "/my-account";
                    }}
                  >
                    View Designs
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <CustomizeHeader />

            {/* My Customizations (logged-in users) */}
            <div className="max-w-3xl mx-auto mb-6">
              <MyCustomizationsPanel onLoadDraft={handleLoadDraft} />
            </div>

            <StepProgress
              steps={steps}
              currentStepIdx={currentStepIdx}
              progressPercent={progressPercent}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isStepComplete={isStepComplete}
              onStepClick={handleStepClick}
              onPrev={handlePrev}
              onNext={handleNext}
            />

            <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
              {/* LEFT SIDE – Step Content */}
              <motion.div layout className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {renderCurrentStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Pricing Calculator (show in media & preview step) */}
                {(currentStep.id === "media" ||
                  currentStep.id === "preview") && (
                  <PricingCalculator
                    canvasQty={canvasQty}
                    canvasFinish={canvasFinish}
                    canvasProduct={canvasProduct}
                  />
                )}

                {/* Navigation Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 pt-4 flex-wrap"
                >
                  {!isFirstStep && (
                    <Button
                      onClick={handlePrev}
                      variant="elegant"
                      className="flex-1 sm:flex-none"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                  )}

                  {/* Autosave indicator */}
                  <button
                    onClick={autosave}
                    className="text-xs text-muted-foreground/50 hover:text-primary/60 transition-colors flex items-center gap-1"
                    title="Save draft to browser (Ctrl+S)"
                  >
                    <Save className="h-3 w-3" />
                    <span className="hidden sm:inline">Save Draft</span>
                  </button>

                  {/* Print specs button */}
                  <button
                    onClick={() => setShowSpecs(true)}
                    className="text-xs text-muted-foreground/50 hover:text-primary/60 transition-colors flex items-center gap-1"
                    title="Print specifications"
                  >
                    <Ruler className="h-3 w-3" />
                    <span className="hidden sm:inline">Print Specs</span>
                  </button>

                  {/* Keyboard shortcut */}
                  <button
                    onClick={() => setShowShortcuts(true)}
                    className="text-xs text-muted-foreground/50 hover:text-primary/60 transition-colors flex items-center gap-1"
                    title="Keyboard shortcuts (?)"
                  >
                    <Keyboard className="h-3 w-3" />
                    <span className="hidden sm:inline">Shortcuts</span>
                  </button>

                  <div className="flex-1" />

                  {/* Step hint */}
                  <div className="text-[10px] text-muted-foreground/30 hidden lg:block">
                    {!isLastStep ? (
                      <span>
                        Press{" "}
                        <kbd className="px-1 py-0.5 bg-secondary rounded text-[9px]">
                          Ctrl+Enter
                        </kbd>{" "}
                        to continue
                      </span>
                    ) : (
                      <span>
                        Press{" "}
                        <kbd className="px-1 py-0.5 bg-secondary rounded text-[9px]">
                          Ctrl+Shift+S
                        </kbd>{" "}
                        to submit
                      </span>
                    )}
                  </div>

                  {!isLastStep ? (
                    <Button
                      onClick={(e) => {
                        createRipple(
                          e as unknown as React.MouseEvent<HTMLButtonElement>,
                        );
                        handleNext();
                      }}
                      className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 ripple-effect"
                    >
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-3 flex-wrap justify-end">
                      <Button
                        onClick={handleShareDraft}
                        variant="elegant"
                        size="sm"
                        title="Share design"
                      >
                        <Share2 className="mr-1.5 h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                      <Button
                        onClick={handleDownloadPreview}
                        variant="elegant"
                        size="sm"
                        title="Download preview"
                      >
                        <Download className="mr-1.5 h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="elegant"
                        disabled={isSubmitting}
                        size="sm"
                      >
                        <RefreshCw className="mr-1.5 h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        onClick={(e) => {
                          createRipple(
                            e as unknown as React.MouseEvent<HTMLButtonElement>,
                          );
                          handleSubmit(e as unknown as FormEvent);
                        }}
                        disabled={isSubmitting || isSuccess}
                        className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 min-w-[160px] ripple-effect"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Magic...
                          </>
                        ) : isSuccess ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Success!
                          </>
                        ) : (
                          <>
                            ✨ Create Card
                            <Heart className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* RIGHT SIDE – Sticky Preview */}
              <div className="lg:sticky lg:top-28 h-fit">
                <div className="card-elegant p-6 md:p-8 relative">
                  {/* Floating decorative particles (deterministic to avoid hydration mismatch) */}
                  {PARTICLE_POSITIONS.map((pos, i) => (
                    <div
                      key={i}
                      className="float-particle absolute w-1 h-1 bg-primary rounded-full"
                      style={{
                        left: `${pos.left}%`,
                        animationDelay: `${pos.delay}s`,
                        animationDuration: `${pos.duration}s`,
                        opacity: 0.4,
                      }}
                    />
                  ))}

                  {/* Sparkling corners */}
                  {[
                    { top: 4, left: 4, delay: 0 },
                    { top: 4, right: 4, delay: 1.5 },
                    { bottom: 4, left: 4, delay: 3 },
                    { bottom: 4, right: 4, delay: 4.5 },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        bottom: pos.bottom,
                        right: pos.right,
                      }}
                    >
                      <Sparkles
                        className="h-4 w-4 text-primary sparkle-animation"
                        style={{ animationDelay: `${pos.delay}s` }}
                      />
                    </div>
                  ))}

                  {/* Step indicator in preview */}
                  <div className="flex items-center justify-between mb-4 relative z-20">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">
                      ✨ Live Preview
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSpecs(true)}
                        className="text-[10px] px-2 py-1 rounded-full bg-primary/5 text-primary/70 hover:bg-primary/10 transition-colors flex items-center gap-1"
                      >
                        <FileImage className="h-3 w-3" />
                        Specs
                      </button>
                      <div className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Step {currentStepIdx + 1}/{steps.length}
                      </div>
                    </div>
                  </div>

                  <div id="live-preview-card">
                    <LivePreview
                      selectedFont={selectedFont}
                      selectedColor={selectedColor}
                      selectedBorder={selectedBorder}
                      selectedTemplate={selectedTemplate}
                      formData={formData}
                      compact
                    />
                  </div>
                </div>

                {/* Quick info bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/30 text-xs text-muted-foreground flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3 text-primary/40" />
                    <span>
                      {currentStep.id === "preview"
                        ? "Looks good? Submit your design!"
                        : "Changes reflect instantly in preview"}
                    </span>
                  </div>
                  <kbd className="px-1.5 py-0.5 bg-background rounded text-[9px] font-mono">
                    {currentStepIdx + 1}/{steps.length}
                  </kbd>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Print Specs Modal */}
        <PrintSpecsModal open={showSpecs} onClose={() => setShowSpecs(false)} />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          open={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </div>
    </CustomizeErrorBoundary>
  );
};

export default Page;
