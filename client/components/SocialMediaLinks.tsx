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
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function SocialMediaLinks() {
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
    <section className="text-center py-3 bg-white dark:bg-[#0F111A]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center gap-6"
      >
        {displayLinks.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="text-xl text-gray-700 dark:text-gray-300 hover:scale-110 transition duration-300 hover:text-rose-800"
          >
            {item.icon}
          </a>
        ))}
      </motion.div>
    </section>
  );
}
