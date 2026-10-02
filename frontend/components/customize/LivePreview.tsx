"use client";

import {
  Sparkles,
  Heart,
  Crown,
  Diamond,
  Flower2,
  Waves,
  Check as CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback } from "react";
import type {
  FontOption,
  ColorTheme,
  BorderStyle,
  CardTemplate,
} from "./types";

// Extend for the main preview in final step
interface LivePreviewProps {
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
  className?: string;
  compact?: boolean;
  showDecorations?: boolean;
}

function OrnamentalDecorations({
  template,
  color,
  compact = false,
}: {
  template: CardTemplate;
  color: string;
  compact?: boolean;
}) {
  const s = compact ? 0.75 : 1;
  const cls = compact ? "text-primary/20" : "text-primary/25";

  return (
    <>
      {template.ornaments.includes("corner-flourish") && (
        <>
          <div
            className={cn(
              "absolute opacity-25",
              compact ? "-top-2 -left-2 w-14 h-14" : "-top-3 -left-3 w-20 h-20",
            )}
          >
            <Sparkles
              className="w-full h-full animate-pulse"
              style={{ color }}
            />
          </div>
          <div
            className={cn(
              "absolute opacity-25",
              compact
                ? "-top-2 -right-2 w-14 h-14"
                : "-top-3 -right-3 w-20 h-20",
            )}
          >
            <Sparkles
              className="w-full h-full animate-pulse"
              style={{ animationDelay: "1s", color }}
            />
          </div>
        </>
      )}

      {template.ornaments.includes("corner-flowers") && (
        <>
          <div
            className={cn(
              "absolute animate-float-slow",
              cls,
              compact ? "top-6 left-6" : "top-10 left-10",
            )}
          >
            <Flower2 className={compact ? "w-6 h-6" : "w-8 h-8"} />
          </div>
          <div
            className={cn(
              "absolute animate-float-slow",
              cls,
              compact ? "top-6 right-6" : "top-10 right-10",
            )}
            style={{ animationDelay: "0.5s" }}
          >
            <Flower2 className={compact ? "w-5 h-5" : "w-6 h-6"} />
          </div>
          <div
            className={cn(
              "absolute animate-float-slow",
              cls,
              compact ? "bottom-6 left-6" : "bottom-10 left-10",
            )}
            style={{ animationDelay: "1.5s" }}
          >
            <Flower2 className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
        </>
      )}

      {template.ornaments.includes("corner-diamond") && (
        <>
          <div
            className={cn(
              "absolute rotate-45 animate-float-slow",
              cls,
              compact ? "top-5 left-5" : "top-8 left-8",
            )}
          >
            <Diamond className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <div
            className={cn(
              "absolute -rotate-45 animate-float-slow",
              cls,
              compact ? "top-5 right-5" : "top-8 right-8",
            )}
            style={{ animationDelay: "0.5s" }}
          >
            <Diamond className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <div
            className={cn(
              "absolute rotate-45 animate-float-slow",
              cls,
              compact ? "bottom-5 left-5" : "bottom-8 left-8",
            )}
            style={{ animationDelay: "1s" }}
          >
            <Diamond className={compact ? "w-3 h-3" : "w-4 h-4"} />
          </div>
          <div
            className={cn(
              "absolute -rotate-45 animate-float-slow",
              cls,
              compact ? "bottom-5 right-5" : "bottom-8 right-8",
            )}
            style={{ animationDelay: "1.5s" }}
          >
            <Diamond className={compact ? "w-3 h-3" : "w-4 h-4"} />
          </div>
        </>
      )}

      {template.ornaments.includes("center-rose") && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/15 animate-float-slow",
          )}
        >
          <Flower2 className={compact ? "w-14 h-14" : "w-16 h-16"} />
        </div>
      )}

      {template.ornaments.includes("center-hexagon") && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow",
            cls,
          )}
          style={{ animationDelay: "0.5s" }}
        >
          <div
            className={cn(
              "border border-current rotate-45 rounded-sm",
              compact ? "w-9 h-9" : "w-10 h-10 border-2",
            )}
          />
        </div>
      )}

      {template.ornaments.includes("center-monogram") && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 animate-float-slow text-primary/20",
            compact ? "top-14" : "top-20",
          )}
        >
          <Crown className={compact ? "w-6 h-6" : "w-8 h-8"} />
        </div>
      )}

      {template.ornaments.includes("side-vine") && (
        <>
          <div
            className={cn(
              "absolute opacity-15 animate-float-slow",
              compact ? "left-3 top-1/4" : "left-5 top-1/4",
            )}
          >
            <Waves className={compact ? "w-5 h-16" : "w-8 h-24"} />
          </div>
          <div
            className={cn(
              "absolute opacity-15 animate-float-slow",
              compact ? "right-3 bottom-1/4" : "right-5 bottom-1/4",
            )}
            style={{ animationDelay: "0.5s" }}
          >
            <Waves
              className={cn(compact ? "w-5 h-16" : "w-8 h-24", "rotate-180")}
            />
          </div>
        </>
      )}
    </>
  );
}

export default function LivePreview({
  selectedFont,
  selectedColor,
  selectedBorder,
  selectedTemplate,
  formData,
  compact = false,
}: LivePreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt effect on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || compact) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      setTilt({ x: rotateX, y: rotateY });
    },
    [compact],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const displayDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Event Date";

  return (
    <div
      className={cn("perspective-1000", !compact && "max-w-[420px] mx-auto")}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "rounded-2xl border-[8px] flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 shadow-xl",
          compact
            ? "aspect-[4/5] p-6 md:p-8"
            : "aspect-[4/5] p-8 md:p-10 shadow-2xl tilt-card",
          selectedBorder.pattern === "floral"
            ? "pattern-floral"
            : selectedBorder.pattern === "geometric"
              ? "pattern-geometric"
              : selectedBorder.pattern === "minimal"
                ? "pattern-minimal"
                : "",
        )}
        style={{
          backgroundColor: selectedColor.secondary,
          borderColor: selectedColor.primary,
          boxShadow: compact
            ? `0 15px 60px rgba(0,0,0,0.1), 0 0 40px ${selectedColor.primary}15`
            : `0 20px 80px rgba(0,0,0,0.15), 0 0 60px ${selectedColor.primary}20, inset 0 0 40px ${selectedColor.primary}08`,
          transform: compact
            ? undefined
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? 20 : 0}px)`,
          transition: isHovered ? "transform 0.1s ease" : "transform 0.5s ease",
        }}
      >
        {/* Glow overlay on hover */}
        {!compact && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 pointer-events-none",
              isHovered ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: `radial-gradient(circle at center, ${selectedColor.primary}08, transparent 70%)`,
            }}
          />
        )}

        <OrnamentalDecorations
          template={selectedTemplate}
          color={selectedColor.primary}
          compact={compact}
        />

        {/* Gradient corners */}
        <div
          className="absolute top-0 left-0 opacity-20"
          style={{
            width: compact ? 80 : 96,
            height: compact ? 80 : 96,
            background: `linear-gradient(135deg, ${selectedColor.primary}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 opacity-20"
          style={{
            width: compact ? 80 : 96,
            height: compact ? 80 : 96,
            background: `linear-gradient(-45deg, ${selectedColor.primary}, transparent)`,
          }}
        />

        {/* Glow edge effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${selectedColor.primary}30, transparent 30%, transparent 70%, ${selectedColor.primary}20)`,
          }}
        />

        <div className="relative z-20 text-shadow-elegant w-full">
          <p
            className="text-[10px] uppercase opacity-60 tracking-[0.3em] mb-6 font-medium"
            style={{ color: selectedColor.primary }}
          >
            WEDDING INVITATION
          </p>

          <h2
            className={cn(
              "mb-2 font-bold leading-tight transition-all duration-300",
              compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
              selectedFont.class,
              isHovered && !compact && "scale-[1.02]",
            )}
            style={{ color: selectedColor.primary }}
          >
            {formData.groomName || "Groom Name"}
          </h2>

          <div className="flex items-center justify-center gap-2 my-4">
            <div
              className="h-px w-10 md:w-12 opacity-50"
              style={{ backgroundColor: selectedColor.primary }}
            />
            <Heart
              className={cn(
                "transition-all duration-300",
                compact ? "h-3.5 w-3.5" : "h-4 w-4",
                isHovered && !compact && "scale-125",
              )}
              style={{ color: selectedColor.primary }}
            />
            <div
              className="h-px w-10 md:w-12 opacity-50"
              style={{ backgroundColor: selectedColor.primary }}
            />
          </div>

          <h2
            className={cn(
              "mb-6 font-bold leading-tight transition-all duration-300",
              compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
              selectedFont.class,
              isHovered && !compact && "scale-[1.02]",
            )}
            style={{ color: selectedColor.primary }}
          >
            {formData.brideName || "Bride Name"}
          </h2>

          <div
            className="w-14 md:w-16 h-px mx-auto my-5 opacity-50"
            style={{ backgroundColor: selectedColor.primary }}
          />

          <p className="text-xs opacity-75 mb-2 capitalize font-medium">
            {displayDate}
          </p>
          <p className="text-xs opacity-75 mb-4 capitalize font-medium">
            {formData.venue || "Venue Location"}
          </p>

          {formData.message && (
            <div className="mt-4">
              <p
                className="text-[10px] italic opacity-60 max-w-[200px] md:max-w-[240px] mx-auto leading-relaxed border-t pt-3"
                style={{ borderColor: `${selectedColor.primary}30` }}
              >
                &ldquo;{formData.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
