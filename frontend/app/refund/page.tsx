"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ReceiptIndianRupee,
  Clock,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const RefundPolicy = () => {
  const router = useRouter();

  const policySections = [
    {
      title: "Cancellations Before Production",
      content:
        "Because every order is printed to your approved proof, you can cancel or amend your order at any time before it enters production. Send us a message within 2 hours of ordering and we will confirm your cancellation in writing.",
    },
    {
      title: "Once Production Has Started",
      content:
        "After your proof is approved and the job is on press, it can no longer be cancelled or refunded in full, because paper, foil, and press time have already been consumed. At this stage we offer a reprint rather than a refund where the fault is ours (see below).",
    },
    {
      title: "Reprint Guarantee",
      content:
        "If your order arrives with a genuine print defect — wrong text, misprint, mis-cut, or damaged in transit — we will reprint it free of charge, including courier charges. Send clear photographs of the defect within 7 days of delivery. Please note that minor variations in shade, texture, and finish are inherent to printing and are not defects.",
    },
    {
      title: "Artwork Errors We Cannot Repeal",
      content:
        "Spelling mistakes, wrong dates, wrong names, and wrong quantities in artwork we proofread and you approved cannot be reprinted at our cost. You are welcome to place a fresh order, and our design team can help you correct the file at a reduced design fee.",
    },
    {
      title: "Late Delivery",
      content:
        "If we miss a date you were given and it was not caused by late proof approval on your side or by a third-party courier, we will either refund the print charge or upgrade your reprint to a premium finish, at your choice.",
    },
    {
      title: "Non-Refundable Items",
      content:
        "Digital services with no physical output — design consultations, logo redraws, and cancelled custom-design sessions — are non-refundable once the work has begun. Rush production surcharges, delivery charges, and already-used coupon discounts are also non-refundable.",
    },
    {
      title: "Requesting a Refund",
      content:
        "Submit refund requests within 7 days of delivery, with your order number and photographs where relevant. We respond to every request within 7 working days. Please keep your request within 120 days of purchase, as payment gateways cannot process refunds beyond that window.",
    },
    {
      title: "Processing Fees",
      content:
        "Refunds are returned to the original payment method. Payment gateway charges and any taxes already deducted cannot be recovered, so the refunded amount may be slightly lower than the amount you paid.",
    },
    {
      title: "Refund Method & Timeline",
      content:
        "Approved refunds are initiated to the original payment method within 7 working days. Your bank or payment provider typically takes a further 5–7 working days to credit the amount back to your account.",
    },
  ];

  return (
    <main className="relative pt-20 min-h-screen bg-card">
      {/* HERO HEADER */}
      <section className="bg-muted border-b border-border py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about the Ink of Memories reprint and
              refund process for custom printing orders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="font-sans text-2xl font-semibold text-foreground mb-8 border-b-2 border-border w-fit pb-2">
              Refund Guidelines
            </h2>

            <div className="space-y-10">
              {policySections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <h3 className="font-sans text-lg font-semibold text-foreground mb-2 group-hover:text-foreground transition-colors">
                    {section.title}:
                  </h3>
                  <p className="text-foreground leading-relaxed text-base md:text-lg">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HELP CALLOUT */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-footer rounded-2xl p-8 md:p-12 text-footer-foreground flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-sans text-2xl md:text-3xl font-semibold mb-2">
              Need clarification?
            </h2>
            <p className="text-foreground opacity-90">
              Our support team is available Mon – Sat, 9:00 AM – 7:00 PM to help
              you with refund and reprint queries.
            </p>
          </div>
          <button
            onClick={() => router.push("/contact")}
            className="bg-card text-foreground px-8 py-4 rounded-xl font-bold hover:bg-ivory transition-all whitespace-nowrap shadow-lg"
          >
            Contact Support
          </button>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicy;
