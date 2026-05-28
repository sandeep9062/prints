"use client";

import { Sparkles, Type, Frame, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LivePreview from "./LivePreview";
import type {
  FontOption,
  ColorTheme,
  BorderStyle,
  CardTemplate,
} from "./types";

// Deterministic decorative particle positions (avoids hydration mismatch)
const PREVIEW_PARTICLES = [
  { left: 15, top: 20, delay: 0.5, duration: 11 },
  { left: 75, top: 35, delay: 2.1, duration: 13 },
  { left: 40, top: 60, delay: 3.8, duration: 10 },
  { left: 85, top: 15, delay: 5.3, duration: 12 },
  { left: 25, top: 80, delay: 0.9, duration: 14 },
  { left: 60, top: 45, delay: 4.6, duration: 11 },
  { left: 10, top: 50, delay: 6.7, duration: 13 },
  { left: 90, top: 70, delay: 1.8, duration: 10 },
  { left: 50, top: 10, delay: 7.2, duration: 12 },
  { left: 35, top: 55, delay: 3.2, duration: 14 },
  { left: 70, top: 85, delay: 5.8, duration: 11 },
  { left: 45, top: 30, delay: 8.1, duration: 13 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface PreviewStepProps {
  selectedFont: FontOption;
  selectedColor: ColorTheme;
  selectedBorder: BorderStyle;
  selectedTemplate: CardTemplate;
  formData: {
    groomName: string;
    brideName: string;
    eventDate: string;
    venue: string;
    message: string;
  };
}

export default function PreviewStep({
  selectedFont,
  selectedColor,
  selectedBorder,
  selectedTemplate,
  formData,
}: PreviewStepProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 relative overflow-hidden">
          {/* Premium Badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-l from-primary/20 to-transparent px-6 py-2 rounded-bl-xl">
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-medium">
                Final Preview
              </span>
            </div>
          </div>

          {/* Floating Gold Particles (deterministic to avoid hydration mismatch) */}
          {PREVIEW_PARTICLES.map((p, i) => (
            <div
              key={i}
              className="float-particle absolute w-1.5 h-1.5 bg-primary rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                opacity: 0.3,
              }}
            />
          ))}

          {/* Corner sparkles */}
          {[
            { top: 6, left: 6, delay: 0 },
            { top: 6, right: 6, delay: 1.5 },
            { bottom: 6, left: 6, delay: 3 },
            { bottom: 6, right: 6, delay: 4.5 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute opacity-50"
              style={{
                top: pos.top !== undefined ? pos.top : undefined,
                bottom: pos.bottom !== undefined ? pos.bottom : undefined,
                left: pos.left !== undefined ? pos.left : undefined,
                right: pos.right !== undefined ? pos.right : undefined,
              }}
            >
              <Sparkles
                className="h-4 w-4 text-primary sparkle-animation"
                style={{ animationDelay: `${pos.delay}s` }}
              />
            </div>
          ))}

          <div className="relative z-20">
            {/* Header Info Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-1.5 text-xs">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="font-medium">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-1.5 text-xs">
                <Type className="h-3 w-3 text-primary" />
                <span className="font-medium">{selectedFont.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-1.5 text-xs">
                <Frame className="h-3 w-3 text-primary" />
                <span className="font-medium">{selectedBorder.name}</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-[0.25em] mb-5">
              ✨ Live Preview
            </h3>

            <LivePreview
              selectedFont={selectedFont}
              selectedColor={selectedColor}
              selectedBorder={selectedBorder}
              selectedTemplate={selectedTemplate}
              formData={formData}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Summary */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-5 md:p-6">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Design Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Font
              </span>
              <p className="font-medium">{selectedFont.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Theme
              </span>
              <p className="font-medium">{selectedColor.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Border
              </span>
              <p className="font-medium">{selectedBorder.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Template
              </span>
              <p className="font-medium">{selectedTemplate.name}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
