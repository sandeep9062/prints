"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { scrollToTop } from "@/lib/smooth-scroll";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isVisible && (
        <button
          type="button"
          onClick={() => scrollToTop()}
          className="p-3 rounded-full bg-brand hover:bg-brand-hover text-primary-foreground shadow-lgfocus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 transition-opacity duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
