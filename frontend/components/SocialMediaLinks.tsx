"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function SocialMediaLinks({
  className,
}: {
  className?: string;
}) {
  const {
    facebook,
    instagram,
    twitter,
    linkedin,
    youtubeUrl,
    pinterest,
    github,
  } = useSiteSettings();

  const socialLinks = [
    { icon: <FaFacebookF />, href: facebook, label: "Facebook" },
    { icon: <FaInstagram />, href: instagram, label: "Instagram" },
    { icon: <FaTwitter />, href: twitter, label: "Twitter" },
    { icon: <FaLinkedinIn />, href: linkedin, label: "LinkedIn" },
    ...(youtubeUrl
      ? [{ icon: <FaYoutube />, href: youtubeUrl, label: "YouTube" }]
      : []),
    ...(pinterest
      ? [{ icon: <FaPinterest />, href: pinterest, label: "Pinterest" }]
      : []),
    ...(github ? [{ icon: <FaGithub />, href: github, label: "GitHub" }] : []),
  ].filter((s) => s.href && s.href !== "");

  // Fallback to hardcoded defaults if none configured
  const fallbackLinks = [
    {
      icon: <FaFacebookF />,
      href: "https://facebook.com/yourcompany",
      label: "Facebook",
    },
    {
      icon: <FaInstagram />,
      href: "https://instagram.com/yourcompany",
      label: "Instagram",
    },
    {
      icon: <FaTwitter />,
      href: "https://twitter.com/yourcompany",
      label: "Twitter",
    },
    {
      icon: <FaLinkedinIn />,
      href: "https://linkedin.com/company/yourcompany",
      label: "LinkedIn",
    },
  ];

  const displayLinks = socialLinks.length > 0 ? socialLinks : fallbackLinks;

  return (
    <nav
      aria-label="Social media"
      className={cn("flex flex-wrap justify-center gap-3", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3"
      >
        {displayLinks.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-900 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 dark:border-stone-700 dark:text-stone-400 dark:hover:border-red-600 dark:hover:text-red-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {item.icon}
          </a>
        ))}
      </motion.div>
    </nav>
  );
}
