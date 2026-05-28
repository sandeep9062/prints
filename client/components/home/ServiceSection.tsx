"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  BookOpen,
  Printer,
  Stamp,
  Notebook,
  ScrollText,
  PenTool,
  Package,
  FileText,
  BadgePercent,
  Layers,
  Sparkles,
} from "lucide-react";

const services = [
  { title: "Wedding Cards", icon: Heart },
  { title: "Visiting Cards", icon: PenTool },
  { title: "Shagun Cards", icon: Sparkles },
  { title: "Invitation Cards", icon: ScrollText },
  { title: "Brochures", icon: BookOpen },
  { title: "Bill Books", icon: FileText },
  { title: "Letterheads", icon: Notebook },
  { title: "Stickers", icon: Package },
  { title: "Rubber Stamps", icon: Stamp },
  { title: "Flex Printing", icon: Printer },
  { title: "Books & Bindings", icon: Layers },
  { title: "Flyers / Pamphlets", icon: BadgePercent },
  { title: "Menu Cards", icon: ScrollText },
  { title: "Posters", icon: BookOpen },
  { title: "Calendars", icon: Layers },
  { title: "Gift Items", icon: Sparkles },
];

export default function ServiceSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#0f111a] dark:to-[#0d1321]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-stone-100"
        >
          Our Printing Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-gray-600 dark:text-stone-300 max-w-2xl mx-auto mb-12"
        >
          We provide high-quality, professional printing services customized for
          your business, events, celebrations, and brand needs.
        </motion.p>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-md hover:shadow-xl transition-all cursor-pointer rounded-2xl group dark:bg-[#0d1321] dark:border-stone-700">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <service.icon className="w-10 h-10 text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-all mb-4" />
                  <p className="font-semibold text-gray-700 dark:text-stone-200 group-hover:text-gray-900 dark:group-hover:text-white">
                    {service.title}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
