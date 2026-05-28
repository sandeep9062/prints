"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Step } from "./types";

interface StepProgressProps {
  steps: Step[];
  currentStepIdx: number;
  progressPercent: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isStepComplete: (idx: number) => boolean;
  onStepClick: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

// Confetti burst helper
function createConfetti() {
  const colors = [
    "#C9A351",
    "#FFD700",
    "#FF6B6B",
    "#48DBFB",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
  ];
  const pieces: {
    color: string;
    left: number;
    delay: number;
    rotation: number;
    size: number;
  }[] = [];
  for (let i = 0; i < 20; i++) {
    pieces.push({
      color: colors[Math.floor(Math.random() * colors.length)],
      left: 20 + Math.random() * 60,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 720,
      size: 4 + Math.random() * 6,
    });
  }
  return pieces;
}

export default function StepProgress({
  steps,
  currentStepIdx,
  progressPercent,
  isFirstStep,
  isLastStep,
  isStepComplete,
  onStepClick,
  onPrev,
  onNext,
}: StepProgressProps) {
  // Show sparkle on step completion
  const showSparkle = currentStepIdx > 0 && currentStepIdx < steps.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-10"
    >
      {/* Progress Bar with glow */}
      <div className="w-full h-2.5 bg-secondary/50 rounded-full overflow-hidden mb-6 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/60 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Shimmer overlay on progress bar */}
          <div className="absolute inset-0 shimmer-wave rounded-full" />
        </motion.div>
      </div>

      {/* Step Indicators - Desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStepIdx;
          const isPast = idx < currentStepIdx;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(idx)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative",
                isActive &&
                  "bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/10",
                isPast && "opacity-80 hover:opacity-100",
                !isActive && !isPast && "opacity-50 hover:opacity-70",
              )}
              disabled={idx > currentStepIdx + 1}
            >
              {/* Step completed sparkle */}
              {isPast && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    delay: idx * 0.1,
                  }}
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                </motion.div>
              )}

              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                    : isPast
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {isPast ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Icon className="h-4 w-4" />
                )}

                {/* Active step glow ring */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-xl border-2 border-primary"
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>
              <div className="text-left hidden md:block">
                <div
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  Step {idx + 1}
                  {isActive && (
                    <motion.span
                      className="inline-block ml-1"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      👉
                    </motion.span>
                  )}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    isActive && "text-primary",
                  )}
                >
                  {step.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className="p-2.5 rounded-xl border border-border/60 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="text-xs text-muted-foreground flex items-center gap-2 justify-center">
            <span>
              Step {currentStepIdx + 1} of {steps.length}
            </span>
            {showSparkle && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block"
              >
                <PartyPopper className="h-3 w-3 text-primary" />
              </motion.span>
            )}
          </div>
          <div className="text-sm font-semibold flex items-center gap-1.5 justify-center">
            {steps[currentStepIdx].label}
            {isLastStep && (
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                🎉
              </motion.span>
            )}
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={isLastStep}
          className="p-2.5 rounded-xl border border-border/60 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
