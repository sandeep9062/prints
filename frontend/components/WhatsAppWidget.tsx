"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink =
    "https://wa.me/919876543210?text=Hello%20Ink%20of%20Memories%20Team%2C%20I%20would%20like%20a%20quotation%20for%20custom%20printing%20%28wedding%20cards%2C%20visiting%20cards%2C%20shagun%20envelopes%2C%20brochures%29.%20Please%20share%20paper%20and%20finishing%20options.";


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Card */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0 mb-4"
            : "opacity-0 translate-y-4 pointer-events-none"
        } w-80 bg-card rounded-xl shadow-xl`}
      >
        {/* Header */}
        <div className="bg-gold text-footer p-4 flex items-start rounded-t-xl">
          <FaWhatsapp className="text-primary-foreground text-3xl mt-1 mr-3" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Start a Conversation</h2>
            <p className="text-sm mt-1 leading-snug">
              Hi! Click on the <strong>WhatsApp</strong> icon below to chat with
              us.
            </p>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-muted text-center text-sm text-muted-foreground py-2">
          The team typically replies in a few minutes.
        </div>

        {/* WhatsApp Button */}
        <div
          onClick={() => window.open(whatsappLink, "_blank")}
          className="cursor-pointer m-3 rounded-xl bg-muted hover:bg-muted p-3 flex items-center shadow-sm transition"
        >
          <div className="bg-[#25D366]/20 p-3 rounded-full">
            <FaWhatsapp className="text-[#25D366] text-2xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-foreground">
              Ink of Memories
            </h3>
            <p className="text-xs text-muted-foreground">Printing Helpdesk</p>
          </div>
          <div className="ml-auto">
            <FaWhatsapp className="text-[#25D366] text-xl" />
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gold hover:bg-gold p-4 rounded-full shadow-xl text-footer transition duration-300"
      >
        {isOpen ? (
          <IoMdClose className="text-primary-foreground text-2xl" />
        ) : (
          <FaWhatsapp className="text-primary-foreground text-2xl" />
        )}
      </button>
    </div>
  );
}
