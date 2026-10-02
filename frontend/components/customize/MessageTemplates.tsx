"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Heart,
  BookOpen,
  Feather,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (message: string) => void;
  currentMessage: string;
}

const MESSAGE_TEMPLATES = [
  {
    category: "Traditional",
    icon: BookOpen,
    templates: [
      "Together with their families, {groomName} & {brideName} request the honour of your presence at their wedding ceremony.",
      "Mr. & Mrs. [Parents] request the pleasure of your company at the marriage of their children, {groomName} & {brideName}.",
      "With joyful hearts, we invite you to celebrate the union of {groomName} & {brideName} as they begin their journey together.",
    ],
  },
  {
    category: "Modern & Casual",
    icon: Sparkles,
    templates: [
      "We're getting married! Join us as {groomName} & {brideName} say 'I do' surrounded by the people they love most.",
      "Two hearts, one love. {groomName} & {brideName} are tying the knot and we want you there to celebrate!",
      "Save the date! {groomName} & {brideName} are officially making it official. Come party with us!",
    ],
  },
  {
    category: "Romantic & Poetic",
    icon: Heart,
    templates: [
      "In the garden of love, two souls have found their forever. {groomName} & {brideName} invite you to witness their blooming romance.",
      "Like verses in a poem, {groomName} & {brideName} are writing their love story. Chapter one begins with you.",
      "Under the same sky where they first met, {groomName} & {brideName} will promise forever. Be there when they do.",
    ],
  },
  {
    category: "Short & Sweet",
    icon: Feather,
    templates: [
      "{groomName} + {brideName} = Forever. Join us for the celebration!",
      "Love brought us together. You keep us surrounded. {groomName} & {brideName}'s wedding.",
      "Two become one. {groomName} & {brideName}. Save the date!",
    ],
  },
  {
    category: "Religious & Spiritual",
    icon: Star,
    templates: [
      "With God's blessing, {groomName} & {brideName} invite you to share in their sacred union.",
      "What God has joined together, let us celebrate. {groomName} & {brideName} request your prayers and presence.",
      "Blessed are they who love. {groomName} & {brideName} begin their journey with faith and your love.",
    ],
  },
];

export default function MessageTemplates({
  isOpen,
  onClose,
  onSelectTemplate,
  currentMessage,
}: MessageTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSelect = (template: string, globalIndex: number) => {
    const filledTemplate = template
      .replace(/{groomName}/g, "Groom Name")
      .replace(/{brideName}/g, "Bride Name");
    onSelectTemplate(filledTemplate);
    setCopiedIndex(globalIndex);
    toast.success("Template added to your message!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  let globalIndex = 0;

  return (
    <AnimatePresence>
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
          className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden ring-1 ring-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Message Templates
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex h-[calc(100%-60px)] overflow-hidden">
            {/* Category sidebar */}
            <div className="w-40 border-r border-border/30 p-3 overflow-y-auto bg-secondary/20">
              <nav className="space-y-1">
                {MESSAGE_TEMPLATES.map((category, idx) => (
                  <button
                    key={category.category}
                    onClick={() => setActiveCategory(idx)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      activeCategory === idx
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    <category.icon className="h-4 w-4" />
                    <span>{category.category}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Templates content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Click any template to use it. Placeholders will be replaced
                    with your names.
                  </p>
                  <div className="space-y-3">
                    {MESSAGE_TEMPLATES[activeCategory].templates.map(
                      (template) => {
                        const index = globalIndex++;
                        return (
                          <motion.div
                            key={template}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group"
                          >
                            <Button
                              variant={
                                copiedIndex === index ? "default" : "elegant"
                              }
                              className="w-full text-left p-4 h-auto min-h-[80px] justify-start gap-3"
                              onClick={() => handleSelect(template, index)}
                            >
                              <div className="flex-1 text-sm leading-relaxed">
                                {template
                                  .replace(
                                    /{groomName}/g,
                                    "<span class='font-medium text-primary'>{groomName}</span>",
                                  )
                                  .replace(
                                    /{brideName}/g,
                                    "<span class='font-medium text-primary'>{brideName}</span>",
                                  )}
                              </div>
                              <div className="flex items-center gap-2">
                                {copiedIndex === index ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                )}
                              </div>
                            </Button>
                          </motion.div>
                        );
                      },
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
