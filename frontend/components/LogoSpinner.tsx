"use client";

import React from "react";
import Image from "next/image";

const LogoSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Container with a subtle, thin spinner */}
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Minimalist Spinner */}
          <div className="absolute inset-0 rounded-full border-[2px] border-gray-100 border-t-gray-800 animate-spin" />

          <Image
            src="/inkofmemories.png"
            alt="Ink of Memories"
            width={480}
            height={480}
            priority
            className="object-contain"
          />
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
