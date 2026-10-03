"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import React, { useSyncExternalStore } from "react";

/**
 * The `.dark` class on <html> is the single source of truth for the colour
 * scheme — Tailwind v4's `dark:` variant keys off it (see globals.css) and the
 * blocking script in app/layout.tsx sets it before first paint. Reading it via
 * useSyncExternalStore keeps this button in sync with that class (including
 * changes made elsewhere) without a setState-in-effect cascade.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

// The server has no way to know the visitor's preference, so render the light
// icon and let the pre-paint script correct it before hydration completes.
function getServerSnapshot() {
  return false;
}

const ToggleButton = () => {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    try {
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    } catch {
      // Private browsing / storage disabled — the class toggle still applies.
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="group p-2 rounded-full hover:bg-foreground/10 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-gold-text dark:text-gold transition-colors group-hover:text-foreground" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gold-text dark:text-gold transition-colors group-hover:text-foreground" />
      )}
    </button>
  );
};

export default ToggleButton;
