"use client";

import { Type, Palette, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FontOption, ColorTheme } from "./types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface StyleStepProps {
  fonts: FontOption[];
  colorThemes: ColorTheme[];
  selectedFont: FontOption;
  selectedColor: ColorTheme;
  onFontChange: (font: FontOption) => void;
  onColorChange: (color: ColorTheme) => void;
}

export default function StyleStep({
  fonts,
  colorThemes,
  selectedFont,
  selectedColor,
  onFontChange,
  onColorChange,
}: StyleStepProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Font Selection */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Type className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Font Style</h2>
              <p className="text-sm text-muted-foreground">
                Choose the typeface that speaks your style
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {fonts.map((font) => (
              <motion.button
                key={font.name}
                type="button"
                onClick={() => onFontChange(font)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl border-2 text-center transition-all duration-200 relative overflow-hidden group",
                  selectedFont.name === font.name
                    ? "border-primary bg-gradient-to-b from-primary/10 to-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/60 hover:border-primary/30 hover:bg-primary/[0.02]",
                )}
              >
                <span
                  className={cn("text-base block leading-tight", font.class)}
                >
                  Aa
                </span>
                <span className="text-[10px] text-muted-foreground block mt-2 opacity-70">
                  {font.name.split(" ")[0]}
                </span>
                {selectedFont.name === font.name && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Color Themes */}
      <motion.div variants={itemVariants}>
        <div className="card-elegant p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Color Theme
              </h2>
              <p className="text-sm text-muted-foreground">
                Set the mood with your color palette
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorThemes.map((theme) => (
              <motion.button
                key={theme.name}
                type="button"
                onClick={() => onColorChange(theme)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group",
                  selectedColor.name === theme.name
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/60 hover:border-primary/30",
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium block">{theme.name}</span>
                <span className="text-[10px] text-muted-foreground/60 block">
                  {theme.description}
                </span>
                {selectedColor.name === theme.name && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Color Preview Strip */}
          <div className="h-3 rounded-full overflow-hidden flex">
            {[
              selectedColor.primary,
              selectedColor.accent,
              selectedColor.secondary,
            ].map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
