"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  Cookie,
  Share2,
  UserCheck,
  Mail,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();

  const sections = [
    {
      icon: Database,
      title: "1 — What Data We Collect",
      content:
        "We may collect personal data when you register, submit enquiries, fill forms, or interact with our website.",
      items: [
        "Basic profile information (name, email, phone number)",
        "Order details — product selections, quantities, paper stock, finish and delivery addresses",
        "Custom artwork, logos, and design files you upload for printing",
        "Usage activity, device info, browser type, IP address",
        "Cookies & tracking data for analytics and UX improvements",
      ],
    },
    {
      icon: Lock,
      title: "2 — How We Use Your Data",
      content:
        "We only use your data to process and deliver your print orders and to improve our printing services.",
      items: [
        "Process your order, produce your prints, and arrange delivery",
        "Share your delivery details with courier partners so your order reaches you",
        "Contact you about your order — proofs, dispatch, and delivery updates",
        "Improve website performance, product previews, and user experience",
        "Send seasonal offers and new design collections (you can opt out anytime)",
      ],
    },
    {
      icon: Cookie,
      title: "3 — Cookies & Tracking",
      content:
        "We use cookies to store small pieces of information which help improve website performance. You may disable cookies in your browser settings — however, some features may not function properly.",
      items: [],
    },
    {
      icon: Share2,
      title: "4 — Data Sharing",
      content:
        "We DO NOT sell your personal data to any third party or advertiser. We may share your data only in the following cases:",
      items: [
        "To comply with legal obligations or government requests",
        "With trusted service providers (ex: email notifications, hosting)",
      ],
    },
    {
      icon: UserCheck,
      title: "5 — Your Rights",
      content:
        "You have full rights under applicable Indian data protection laws:",
      items: [
        "Right to access your data and order history",
        "Right to correct or request data deletion",
        "Right to withdraw consent anytime",
      ],
    },
    {
      icon: Mail,
      title: "6 — Contact Us",
      content:
        "If you have any questions regarding this Privacy Policy, or want to request data changes or deletion of your uploaded artwork, please contact us:",
      items: [],
      email: "info@inkofmemories.com",
    },
  ];

  return (
    <main className="relative min-h-screen bg-white">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-r from-[#E4E9DD] to-[#DDE3D3] pt-30 py-20 text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Shield size={400} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-[#1F3A32] font-bold uppercase tracking-widest text-sm mb-4">
              <AlertTriangle size={18} />
              Privacy & Security
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-900 text-lg leading-relaxed">
              At <strong>Ink of Memories</strong>, your privacy is extremely
              important to us. This Privacy Policy explains how we collect,
              use, and safeguard your personal data when you order custom
              printing and stationery from our platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LAST UPDATED */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm mt-6 mb-2">
            Last updated: November 8, 2025
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* INTRO BOX */}
            <div className="bg-[#F7F4EE] border-l-4 border-[#1F3A32] p-6 mb-12 rounded-r-xl shadow-sm">
              <div className="flex gap-4">
                <Info className="text-[#1F3A32] shrink-0" />
                <p className="text-slate-700 text-sm md:text-base italic">
                  By using our website, you consent to our Privacy Policy.
                  Please read the following information carefully to understand
                  our views and practices regarding your personal data.
                </p>
              </div>
            </div>

            {/* SECTIONS */}
            <div className="space-y-14">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-500 shrink-0 group-hover:bg-[#1F3A32] group-hover:text-white transition-all duration-300">
                      <section.icon size={22} />
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#1F3A32] transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-3">
                        {section.content}
                      </p>

                      {section.items.length > 0 && (
                        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 text-slate-600 text-base md:text-lg">
                          {section.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {section.email && (
                        <p className="text-slate-900 font-semibold text-base md:text-lg mt-2">
                          Email:{" "}
                          <span className="text-[#1F3A32]">
                            {section.email}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HELP CALLOUT */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1F3A32] rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Have questions about your privacy?
              </h2>
              <p className="text-[#E4E9DD] opacity-90">
                Our team is here to help with any concerns or clarifications.
              </p>
            </div>
            <button
              onClick={() => router.push("/contact")}
              className="bg-white text-[#1F3A32] px-8 py-4 rounded-xl font-bold hover:bg-[#F7F4EE] transition-all whitespace-nowrap shadow-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
