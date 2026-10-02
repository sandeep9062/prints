"use client";

import React, { useRef } from "react";

interface GlowCardProps {
  card: {
    review?: string;
  };
  index: number;
  children?: React.ReactNode;
}

const GlowCard: React.FC<GlowCardProps> = ({ card, index, children }) => {
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const handleMouseMove = (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = cardRefs.current[i];
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    cardEl.style.setProperty("--start", `${angle + 60}`);
  };

  return (
    <div
      ref={(el) => {
        if (el) cardRefs.current[index] = el;
      }}
      onMouseMove={handleMouseMove(index)}
      className="card card-border timeline-card rounded-xl p-10 mb-5 break-inside-avoid-column relative"
    >
      <div className="glow"></div>

      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <img key={i} src="/images/star.png" alt="star" className="size-5" />
        ))}
      </div>

      <div className="mb-5">
        <p className="text-white/50 text-lg">{card?.review}</p>
      </div>

      {children}
    </div>
  );
};

<style jsx>{`
.card {
  --start: 0;
  position: relative;
  z-index: 40;
  overflow: hidden;
  transition: border-color 1s ease-in-out;
}

.card::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  border: 2px solid transparent;
  background: var(--gradient);
  background-attachment: fixed;
  mask: linear-gradient(#0000, #0000),
    conic-gradient(
      from calc((var(--start) - 15) * 1deg),
      #ffffff1f 0deg,
      white,
      #ffffff00 100deg
    );
  mask-composite: intersect;
  mask-clip: padding-box, border-box;
  opacity: 0;
  transition: 0.5s ease;
}

.glow {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  filter: blur(10px);
  filter: saturate(200);
}

.card:hover::before {
  opacity: 1;
}
`}</style>













export default GlowCard;
