"use client";

import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the treatment plan work?",
    answer:
      "Simply select your dental problems and preferred location. Our expert dentists will review your case and provide a detailed treatment plan within 24 hours.",
  },
  {
    question: "Is the ₹149/- fee refundable?",
    answer:
      "The consultation fee is non-refundable, but it will be adjusted against your final treatment cost if you proceed with any of our partner clinics.",
  },
  {
    question: "How accurate are the cost estimates?",
    answer:
      "Our estimates are based on current market rates and expert analysis. Final costs may vary after in-person examination.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="grid gap-8 mt-20 mb-12 md:grid-cols-1">
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <h3 className="text-xl font-bold text-[#2C73D2] mb-4">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h4 className="mb-2 font-semibold text-gray-800">
                {faq.question}
              </h4>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
