"use client";

import React from "react";

const LogoSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-card">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Container with a subtle, thin spinner */}
        <div className="relative flex items-center justify-center w-70 h-70">
          {/* Minimalist Spinner */}

          {/* Text wordmark, matching the Navbar and /auth. The loader renders on
              bg-card, which re-points per theme, so the same page-level
              text-foreground / text-primary roles stay readable in both themes. */}
          <span className="relative z-10 px-8 text-center font-sans text-xl font-semibold tracking-wider text-foreground">
            INK <span className="text-primary">OF</span> MEMORIES
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoSpinner;
