"use client";

import {
  Heart,
  Gem,
  PartyPopper,
  MapPin,
  BookHeart,
  ScrollText,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ValidationErrors } from "./types";
import { mockVenueSuggestions } from "./data";
import { useState, useEffect, useMemo, useCallback } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface DetailsStepProps {
  formData: {
    groomName: string;
    brideName: string;
    eventDate: string;
    venue: string;
    message: string;
  };
  validationErrors: ValidationErrors;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

// Auto-capitalize names helper
function autoCapitalize(value: string): string {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function DetailsStep({
  formData,
  validationErrors,
  onInputChange,
}: DetailsStepProps) {
  const [venueSearch, setVenueSearch] = useState(formData.venue);
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Filter venue suggestions
  const venueSuggestions = useMemo(() => {
    if (!venueSearch.trim()) return mockVenueSuggestions.slice(0, 4);
    return mockVenueSuggestions.filter((v) =>
      v.toLowerCase().includes(venueSearch.toLowerCase()),
    );
  }, [venueSearch]);

  // Sync venue search with form data
  useEffect(() => {
    setVenueSearch(formData.venue);
  }, [formData.venue]);

  // Handle venue select
  const handleVenueSelect = useCallback(
    (venue: string) => {
      const syntheticEvent = {
        target: { name: "venue", value: venue },
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(syntheticEvent);
      setShowVenueSuggestions(false);
    },
    [onInputChange],
  );

  // Handle name blur - auto capitalize
  const handleNameBlur = useCallback(
    (field: string) => {
      const value = formData[field as keyof typeof formData];
      if (value && field !== "message" && field !== "eventDate") {
        const capitalized = autoCapitalize(value);
        if (capitalized !== value) {
          const syntheticEvent = {
            target: { name: field, value: capitalized },
          } as React.ChangeEvent<HTMLInputElement>;
          onInputChange(syntheticEvent);
        }
      }
      setFocusedField(null);
    },
    [formData, onInputChange],
  );

  // Message character count
  const messageCount = formData.message.length;
  const messageLimit = 500;

  // Calculate completeness
  const filledFields = [
    formData.groomName,
    formData.brideName,
    formData.eventDate,
    formData.venue,
  ].filter(Boolean).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Step progress indicator */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(filledFields / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="font-medium min-w-[60px] text-right">
          {filledFields}/4
        </span>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20 relative overflow-hidden">
              <ScrollText className="h-6 w-6 text-primary relative z-10" />
              <div className="absolute inset-0 shimmer-wave opacity-50" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Names & Event Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us about the happy couple and your special day
              </p>
            </div>
            {/* Magic wand hint */}
            <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] text-primary/50">
              <Sparkles className="h-3 w-3" />
              <span>Auto-capitalize names</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-primary/60" />
                Groom's Name
                <span className="text-red-400">*</span>
              </label>
              <Input
                name="groomName"
                value={formData.groomName}
                onChange={onInputChange}
                onFocus={() => setFocusedField("groomName")}
                onBlur={() => handleNameBlur("groomName")}
                placeholder="Enter groom's name"
                className={cn(
                  "h-11 transition-all duration-200 focus-visible:ring-primary",
                  validationErrors.groomName &&
                    "border-red-400 focus-visible:ring-red-400",
                  focusedField === "groomName" && "ring-2 ring-primary/20",
                )}
              />
              {validationErrors.groomName && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.groomName}
                </motion.p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Gem className="h-3.5 w-3.5 text-primary/60" />
                Bride's Name
                <span className="text-red-400">*</span>
              </label>
              <Input
                name="brideName"
                value={formData.brideName}
                onChange={onInputChange}
                onFocus={() => setFocusedField("brideName")}
                onBlur={() => handleNameBlur("brideName")}
                placeholder="Enter bride's name"
                className={cn(
                  "h-11 transition-all duration-200 focus-visible:ring-primary",
                  validationErrors.brideName &&
                    "border-red-400 focus-visible:ring-red-400",
                  focusedField === "brideName" && "ring-2 ring-primary/20",
                )}
              />
              {validationErrors.brideName && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.brideName}
                </motion.p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <PartyPopper className="h-3.5 w-3.5 text-primary/60" />
                Event Date
                <span className="text-red-400">*</span>
              </label>
              <Input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={onInputChange}
                className={cn(
                  "h-11 transition-all duration-200 focus-visible:ring-primary",
                  validationErrors.eventDate &&
                    "border-red-400 focus-visible:ring-red-400",
                )}
              />
              {validationErrors.eventDate && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.eventDate}
                </motion.p>
              )}
              {formData.eventDate && !validationErrors.eventDate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-primary/50 flex items-center gap-1"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {new Date(formData.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </motion.p>
              )}
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                Venue
                <span className="text-red-400">*</span>
              </label>
              <Input
                name="venue"
                placeholder="Event venue"
                value={formData.venue}
                onChange={(e) => {
                  onInputChange(e);
                  setVenueSearch(e.target.value);
                }}
                onFocus={() => {
                  setFocusedField("venue");
                  if (venueSearch) setShowVenueSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowVenueSuggestions(false), 200);
                  setFocusedField(null);
                }}
                className={cn(
                  "h-11 transition-all duration-200 focus-visible:ring-primary",
                  validationErrors.venue &&
                    "border-red-400 focus-visible:ring-red-400",
                  focusedField === "venue" && "ring-2 ring-primary/20",
                )}
              />
              {/* Venue suggestions */}
              <AnimatePresence>
                {showVenueSuggestions && venueSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2 border-b border-border/30 flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 text-primary/50" />
                      <span className="text-[10px] text-muted-foreground">
                        Suggestions
                      </span>
                    </div>
                    {venueSuggestions.map((venue) => (
                      <button
                        key={venue}
                        type="button"
                        onMouseDown={() => handleVenueSelect(venue)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors flex items-center gap-2 group"
                      >
                        <MapPin className="h-3 w-3 text-primary/30 group-hover:text-primary/60 transition-colors" />
                        {venue}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {validationErrors.venue && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.venue}
                </motion.p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <BookHeart className="h-3.5 w-3.5 text-primary/60" />
              Custom Message
            </label>
            <div className="relative">
              <Textarea
                name="message"
                value={formData.message}
                onChange={onInputChange}
                rows={4}
                maxLength={messageLimit}
                placeholder="Write your invitation message..."
                className="resize-none transition-all duration-200 focus-visible:ring-primary pr-16"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/50 font-mono">
                {messageCount}/{messageLimit}
              </div>
            </div>
            <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
              <BookHeart className="h-3 w-3" />A personal note to your guests
              (optional)
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
