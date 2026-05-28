"use client";

import {
  Frame,
  Layout,
  Check,
  Flower2,
  Heart,
  Diamond,
  Waves,
  Crown,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BorderStyle, CardTemplate, ColorTheme } from "./types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface DesignStepProps {
  borderStyles: BorderStyle[];
  cardTemplates: CardTemplate[];
  selectedBorder: BorderStyle;
  selectedTemplate: CardTemplate;
  selectedColor: ColorTheme;
  onBorderChange: (border: BorderStyle) => void;
  onTemplateChange: (template: CardTemplate) => void;
}

function renderOrnamentIcon(ornament: string) {
  if (ornament.includes("flower"))
    return <Flower2 className="h-2.5 w-2.5 text-primary/60" />;
  if (ornament.includes("heart"))
    return <Heart className="h-2.5 w-2.5 text-primary/60" />;
  if (ornament.includes("diamond"))
    return <Diamond className="h-2.5 w-2.5 text-primary/60" />;
  if (ornament.includes("curl"))
    return <Waves className="h-2.5 w-2.5 text-primary/60" />;
  if (ornament.includes("monogram"))
    return <Crown className="h-2.5 w-2.5 text-primary/60" />;
  if (ornament.includes("flourish"))
    return <Sparkles className="h-2.5 w-2.5 text-primary/60" />;
  return <div className="w-1 h-1 rounded-full bg-primary/60" />;
}

export default function DesignStep({
  borderStyles,
  cardTemplates,
  selectedBorder,
  selectedTemplate,
  selectedColor,
  onBorderChange,
  onTemplateChange,
}: DesignStepProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Border Styles */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Frame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Border Style
              </h2>
              <p className="text-sm text-muted-foreground">
                Frame your invitation with the perfect border
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {borderStyles.map((border) => {
              const Icon = border.icon;
              return (
                <motion.button
                  key={border.name}
                  type="button"
                  onClick={() => onBorderChange(border)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "p-5 rounded-xl border-2 text-center transition-all duration-200 relative group",
                    selectedBorder.name === border.name
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border/60 hover:border-primary/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-full aspect-square flex items-center justify-center rounded-lg mb-2 transition-transform duration-300 group-hover:scale-110",
                      border.pattern === "floral" && "pattern-floral-2",
                      border.pattern === "geometric" && "pattern-geometric-2",
                      border.pattern === "minimal" && "pattern-minimal-2",
                    )}
                    style={
                      border.pattern === "solid"
                        ? { border: `3px solid ${selectedColor.primary}` }
                        : undefined
                    }
                  >
                    <Icon
                      className="h-7 w-7"
                      style={{ color: selectedColor.primary }}
                    />
                  </div>
                  <span className="text-sm font-medium block">
                    {border.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 block">
                    {border.description}
                  </span>
                  {selectedBorder.name === border.name && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Card Templates */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Layout className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Card Template
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick a layout that matches your vision
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cardTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <motion.button
                  key={template.name}
                  type="button"
                  onClick={() => onTemplateChange(template)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "p-5 rounded-xl border-2 text-left transition-all duration-200 relative group",
                    selectedTemplate.name === template.name
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border/60 hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon
                      className="h-5 w-5"
                      style={{ color: selectedColor.primary }}
                    />
                    <div className="flex-1 grid grid-cols-4 gap-1">
                      {template.ornaments.slice(0, 4).map((ornament, idx) => (
                        <div
                          key={idx}
                          className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded text-[8px] flex items-center justify-center"
                        >
                          {renderOrnamentIcon(ornament)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-medium block">
                    {template.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 block">
                    {template.description}
                  </span>
                  {selectedTemplate.name === template.name && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
