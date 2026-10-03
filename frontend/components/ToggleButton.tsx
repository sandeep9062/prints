"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const ToggleButton = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial theme based on localStorage only, default to light
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
    } else {
      setIsDark(false); // Default to light mode
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark((prevTheme) => !prevTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="group p-2 rounded-full hover:bg-[#1F3A32]/10 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-[#B08D4A] transition-colors group-hover:text-[#1F3A32] dark:text-[#D2AE62] dark:group-hover:text-[#F7F4EE]" />
      ) : (
        <MoonIcon className="h-5 w-5 text-[#B08D4A] transition-colors group-hover:text-[#1F3A32] dark:text-[#D2AE62] dark:group-hover:text-[#F7F4EE]" />
      )}
    </button>
  );
};

export default ToggleButton;
