"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { whatsAppNo, websiteName } = useSiteSettings();

  const cleanNumber = whatsAppNo.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Card */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0 mb-4"
            : "opacity-0 translate-y-4 pointer-events-none"
        } w-80 bg-white rounded-xl shadow-xl`}
      >
        {/* Header */}
        <div className="bg-[#d4af37] text-white p-4 flex items-start rounded-t-xl">
          <FaWhatsapp className="text-white text-3xl mt-1 mr-3" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Start a Conversation</h2>
            <p className="text-sm mt-1 leading-snug">
              Hi! Click on the <strong>WhatsApp</strong> icon below to chat with
              us.
            </p>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-gray-100 text-center text-sm text-gray-600 py-2">
          The team typically replies in a few minutes.
        </div>

        {/* WhatsApp Button */}
        <div
          onClick={() => window.open(whatsappLink, "_blank")}
          className="cursor-pointer m-3 rounded-xl bg-gray-50 hover:bg-gray-100 p-3 flex items-center shadow-sm transition"
        >
          <div className="bg-[#25D366]/20 p-3 rounded-full">
            <FaWhatsapp className="text-[#25D366] text-2xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-gray-800">Maldonite</h3>
            <p className="text-xs text-gray-500">Helpdesk</p>
          </div>
          <div className="ml-auto">
            <FaWhatsapp className="text-[#25D366] text-xl" />
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#d4af37] hover:bg-[#c2a536] p-4 rounded-full shadow-xl text-white transition duration-300"
      >
        {isOpen ? (
          <IoMdClose className="text-white text-2xl" />
        ) : (
          <FaWhatsapp className="text-white text-2xl" />
        )}
      </button>
    </div>
  );
}
