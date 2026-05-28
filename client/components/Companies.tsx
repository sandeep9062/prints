"use client";
import React from "react";
import Image from "next/image";

const Companies = () => {
  const logos = [
    { src: "/prologis.png", alt: "Prologis" },
    { src: "/tower.png", alt: "Tower" },
    { src: "/equinix.png", alt: "Equinix" },
    { src: "/realty.png", alt: "Realty" },
    { src: "/prologis.png", alt: "Prologis" },
    { src: "/tower.png", alt: "Tower" },
    { src: "/equinix.png", alt: "Equinix" },
    { src: "/realty.png", alt: "Realty" },
  ];

  return (
    <section className="w-full py-5 sm:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative w-full overflow-hidden">
          {/* LEFT GRADIENT */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-20"></div>

          {/* RIGHT GRADIENT */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-20"></div>

          {/* Slider Track */}
          <div className="flex items-center gap-10 animate-scroll whitespace-nowrap">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-20 sm:h-24 w-32 sm:w-40 flex-shrink-0 opacity-90 hover:opacity-100 transition"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="w-24 sm:w-32 object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style>
        {`
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </section>
  );
};

export default Companies;
