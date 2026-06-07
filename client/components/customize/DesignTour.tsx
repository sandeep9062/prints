"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DesignTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Design Studio",
    description:
      "Create stunning wedding invitations in minutes. Our guided process makes it easy to design something truly unique.",
    target: null,
    position: "center",
  },
  {
    id: "details",
    title: "Start with Details",
    description:
      "Enter the couple's names, wedding date, venue, and a personal message. This information appears on your invitation.",
    target: "[data-tour='details']",
    position: "bottom",
  },
  {
    id: "style",
    title: "Choose Your Style",
    description:
      "Pick from elegant fonts and curated color themes. Each theme is professionally designed for perfect harmony.",
    target: "[data-tour='style']",
    position: "bottom",
  },
  {
    id: "design",
    title: "Customize the Design",
    description:
      "Select border styles and card templates. Add floral, geometric, or minimalist decorative elements.",
    target: "[data-tour='design']",
    position: "bottom",
  },
  {
    id: "media",
    title: "Add Photos & Specs",
    description:
      "Upload reference photos, choose paper finish (matte/gloss/textured), product type, and quantity with bulk discounts.",
    target: "[data-tour='media']",
    position: "bottom",
  },
  {
    id: "preview",
    title: "Preview & Order",
    description:
      "See your design come to life with 3D preview. Check pricing, then submit for professional printing.",
    target: "[data-tour='preview']",
    position: "bottom",
  },
];

export default function DesignTour({
  isOpen,
  onClose,
  onComplete,
}: DesignTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-background rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden ring-1 ring-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress indicator */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-2 mb-2">
            {TOUR_STEPS.map((_, idx) => (
              <motion.div
                key={idx}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-300",
                  idx <= currentStep ? "bg-primary" : "bg-secondary/50",
                )}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
            <span>
              {Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {step.target ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {step.description}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip Tour
          </Button>
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <Button variant="elegant" size="sm" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className={cn(
                "min-w-[120px]",
                isLastStep ? "bg-primary text-white" : "",
              )}
            >
              {isLastStep ? (
                <>
                  Get Started
                  <Check className="ml-1.5 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
