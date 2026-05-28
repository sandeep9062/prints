"use client";

import { Sparkles, Wand2, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TYPEWRITER_WORDS = [
  "Dream Invitation",
  "Perfect Card",
  "Magical Design",
  "Timeless Keepsake",
];

export default function CustomizeHeader() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentWord = TYPEWRITER_WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 80);
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 40);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl mx-auto mb-12 relative"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full px-5 py-2 mb-5 ring-1 ring-primary/10 group hover:ring-primary/30 transition-all duration-300">
        <Wand2 className="h-4 w-4 text-primary animate-float-bounce" />
        <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Design Studio
        </span>
        <Sparkles className="h-3.5 w-3.5 text-primary sparkle-animation" />
      </div>

      <h1 className="font-display text-4xl md:text-6xl font-semibold mb-4 tracking-tight">
        Customize Your
        <span className="block text-primary mt-2 relative">
          <span className="relative inline-block">
            Perfect Invitation
            <motion.span
              className="absolute -top-1 -right-3 text-xs"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ✨
            </motion.span>
          </span>
        </span>
      </h1>

      {/* Typewriter subtitle */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground/80 text-base md:text-lg max-w-xl mx-auto mb-4">
        <span>Your</span>
        <span className="relative font-semibold text-primary min-w-[160px] text-left">
          <span>{displayText}</span>
          <span className="absolute -right-2 top-0.5 w-[2px] h-5 bg-primary animate-pulse" />
        </span>
        <span>, beautifully crafted.</span>
      </div>

      {/*
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="flex items-center justify-center gap-1 text-xs text-muted-foreground/40 mt-6"
      >
        <ArrowDown className="h-3 w-3 animate-bounce" />
        <span>Begin below</span>
        <ArrowDown className="h-3 w-3 animate-bounce" style={{ animationDelay: "0.2s" }} />
      </motion.div>
      */}
    </motion.div>
  );
}
