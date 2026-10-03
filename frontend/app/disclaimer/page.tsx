"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";

import { LEGAL_NAME } from "@/lib/site-config";

const DisclaimerPage = () => {
  const disclaimerSections = [
    {
      id: 1,
      title: "Accuracy of Information",
      content:
        "Product photographs, previews, colour references and descriptions on this platform are provided in good faith to help you choose. Paper stocks, GSM, foils, and finishes are natural materials and may vary slightly between batches — we do not guarantee that every item is perfectly identical to the on-screen representation.",
    },
    {
      id: 2,
      title: "Colour Reproduction",
      content:
        "Ink of Memories does not guarantee that colours viewed on your monitor, tablet, or phone will match the physical print exactly. Screens are backlit and use different colour profiles than CMYK press output. We share a proof before production so you can approve the real result on real paper.",
    },
    {
      id: 3,
      title: "Custom Artwork & Print-Readiness",
      content:
        "You are responsible for supplying artwork that is legally yours to print and technically suitable for production. We may reject files that are low-resolution, incorrect colour mode, or impossible to reproduce in the chosen finish. We are not liable for print-quality issues arising from artwork we flagged and you approved.",
    },
    {
      id: 4,
      title: "Content Ownership",
      content:
        "All designs, layouts, copy, and imagery on Ink of Memories belong to Ink of Memories or are licensed from third-party providers. Artwork you upload remains yours; you grant us only the licence needed to print your order.",
    },
    {
      id: 5,
      title: "Non-Endorsement",
      content:
        "Displaying a product on Ink of Memories does not imply any endorsement or recommendation beyond our own manufacturing capability. Orders are supplied on the specifications confirmed in your quotation.",
    },
    {
      id: 6,
      title: "Delivery & Event Dates",
      content:
        "We work hard to meet the date you tell us about, but production timelines depend on artwork approval, quantity, finish complexity, and courier availability. We are not liable for costs or consequences arising from a late delivery caused by a delay in your proof approval or by third-party courier delays.",
    },
    {
      id: 7,
      title: "Limitation of Services",
      content:
        "Ink of Memories is an online printing and stationery platform operated by our own Panchkula press. We print what you order — we are not a marketplace, a broker, or a third-party contractor, and all work is produced in our own atelier.",
    },
    {
      id: 8,
      title: "Modification of Terms",
      content:
        "Ink of Memories reserves the right to update or modify these disclaimers at any time without prior notice. Users are encouraged to review these terms regularly to stay informed.",
    },
  ];

  return (
    <main className="min-h-screen bg-card">
      {/* HEADER SECTION */}
      <section className="bg-gradient-to-r to-brand-hover from-muted to-brand-soft pt-30 py-20 text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <ShieldAlert size={400} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-4">
              <AlertTriangle size={18} />
              Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Disclaimer
            </h1>
            <p className=" text-foreground text-lg leading-relaxed">
              Ink of Memories is the online identity of our Panchkula press,
              and is used throughout this platform to represent our printing,
              design and stationery services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* INTRO BOX */}
            <div className="bg-ivory border-l-4 border-foreground p-6 mb-12 rounded-r-xl shadow-sm">
              <div className="flex gap-4">
                <Info className="text-foreground shrink-0" />
                <p className="text-foreground text-sm md:text-base italic">
                  By using <strong>Ink of Memories</strong>, users agree to these terms
                  and acknowledge that colour reproduction, delivery timelines
                  and print quality depend on the specifications approved in
                  their order.
                </p>
              </div>
            </div>

            {/* DISCLAIMER LIST */}
            <div className="grid grid-cols-1 gap-12">
              {disclaimerSections.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-bold text-sm shrink-0 group-hover:bg-footer group-hover:text-footer-foreground transition-colors">
                      {item.id}
                    </span>
                    <div>
                      <h2 className="font-sans text-xl font-semibold text-foreground mb-3 group-hover:text-foreground transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed md:text-lg">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FOOTER NOTE */}
            <div className="mt-20 pt-10 border-t border-border text-center">
              <p className="text-muted-foreground text-sm">
                Last Updated: February 2026 • © {new Date().getFullYear()}{" "}
                {LEGAL_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DisclaimerPage;
