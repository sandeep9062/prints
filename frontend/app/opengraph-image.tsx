import { ImageResponse } from "next/og";

import { BRAND_NAME } from "@/lib/site-config";
import { SITE_CONFIG } from "@/lib/seo";

/*
  Dynamic Open Graph / Twitter card image.

  Why this exists
  ---------------
  The previous OG image was `inkofmemories.png` — a 6250x6250 (1.5 MB) square
  logo that every page declared as `width=1200 height=630`. The declared ratio
  did not match the file, so Facebook, WhatsApp and X cropped or letterboxed it
  into an unreadable sliver, and every link on the site shared the same preview.

  Satori (the renderer behind `next/og`) draws this at build time, so the output
  is always exactly the 1200x630 that the metadata declares, and it costs no
  runtime work in production.

  Caveat: Satori requires all layout to be flex-based and has no CSS shorthand.
*/

export const alt = `${BRAND_NAME} — Premium Printing & Design Services`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          // Brand ink blue, matching viewport themeColor #2D47BE.
          backgroundColor: "#1B2E7A",
          backgroundImage:
            "radial-gradient(circle at 18% 12%, #2D47BE 0%, transparent 55%), radial-gradient(circle at 85% 88%, #0E1A4A 0%, transparent 60%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 72,
          textAlign: "center",
        }}
      >
        {/* Gold rule — mirrors the accent hairline used across the site. */}
        <div
          style={{
            width: 96,
            height: 4,
            backgroundColor: "#D4AF37",
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 92,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: -2,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          Ink of Memories
        </div>

        <div
          style={{
            fontSize: 36,
            color: "#D8E0FF",
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          Premium Printing &amp; Design Services
        </div>

        <div
          style={{
            fontSize: 27,
            color: "#A9B6E8",
            display: "flex",
          }}
        >
          Wedding cards · Visiting cards · Brochures · Banners · Packaging
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "14px 34px",
            border: "2px solid #D4AF37",
            borderRadius: 999,
            color: "#F5DFA0",
            fontSize: 25,
            display: "flex",
          }}
        >
          {SITE_CONFIG.address.city} · Since 1984
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        // Safe to cache at the edge for a day; content only changes with a deploy.
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}