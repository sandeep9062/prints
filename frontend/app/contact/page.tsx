"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/editorial/PageHeader";
import { TextAreaField, TextField } from "@/components/editorial/Field";
import { SEOHelper } from "@/components/SEOHelper";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getBreadcrumbSchema } from "@/lib/seo";

interface ContactItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  href?: string;
}

const Contact = () => {
  const { mainOffice, contactNo1, email, whatsAppNo } = useSiteSettings();

  const contactInfo: ContactItem[] = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: mainOffice
        ? mainOffice.split(",").map((s: string) => s.trim())
        : ["123 Printing Street", "Design District, Mumbai 400001"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: contactNo1 ? [contactNo1] : ["+91 98765 43210"],
      href: contactNo1 ? `tel:${contactNo1.replace(/\s/g, "")}` : undefined,
    },
    {
      icon: Mail,
      title: "Email Us",
      details: email ? [email] : ["info@samlason.com"],
      href: email ? `mailto:${email}` : undefined,
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"],
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const openWhatsApp = () => {
    const clean = (whatsAppNo || "919876543210").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${clean}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] dark:bg-[#0f111a]">
      <SEOHelper
        title="Contact Us – Samlason Printing Press, Panchkula"
        description="Get in touch with Samlason Printing Press. Call, email, or visit us in Panchkula for premium wedding cards, visiting cards, brochures & custom printing."
        path="/contact"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="contact printing press, Samlason Printing contact, Panchkula printing press, custom printing inquiry"
        jsonLd={breadcrumbSchema}
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)] pb-24">
        <div className="container mx-auto px-6">
          {/* ───────── Page header ───────── */}
          <PageHeader
            eyebrow="We'd Love to Hear From You"
            title="Get in"
            accent="Touch"
            description="Questions about a job, a quote, or a custom suite? Send a note below or reach us directly — our team in Panchkula replies within 24 hours."
          />

          {/* ───────── Contact details ───────── */}
          <section className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-stone-700 dark:bg-stone-700">
            {contactInfo.map(({ icon: Icon, title, details, href }) => (
              <div key={title} className="bg-[#FCFBF9] p-8 dark:bg-[#0f111a]">
                <div className="flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-500 transition-colors duration-300 hover:border-red-900 hover:text-red-900 dark:border-stone-700 dark:text-stone-400 dark:hover:border-red-600 dark:hover:text-red-600">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </div>

                <h2 className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500">
                  {title}
                </h2>

                <div className="mt-3 space-y-1">
                  {details.map((detail, i) =>
                    href && i === 0 ? (
                      <a
                        key={i}
                        href={href}
                        className="block text-sm font-light leading-relaxed text-stone-700 underline-offset-4 transition-colors hover:text-red-900 hover:underline dark:text-stone-300 dark:hover:text-red-600"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p
                        key={i}
                        className="text-sm font-light leading-relaxed text-stone-700 dark:text-stone-300"
                      >
                        {detail}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ))}
          </section>
{/* ───────── Form + WhatsApp ───────── */}
          <section className="mt-20 grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-red-800 dark:bg-red-600"
                />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                  Send us a Message
                </h2>
              </div>
              <h3 className="mt-4 font-serif text-3xl leading-tight text-stone-900 md:text-4xl dark:text-stone-100">
                Tell us what you&apos;re
                <br />
                <em className="font-light text-red-800 dark:text-red-600">
                  looking to print.
                </em>
              </h3>

              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
                noValidate={false}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <TextAreaField
                  label="Message"
                  name="message"
                  placeholder="Tell us about your requirements — quantity, paper, finish, deadline..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />

                <button
                  type="submit"
                  className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-none bg-red-900 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-offset-[#0f111a]"
                >
                  Send Message
                  <Send
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </button>
              </form>
            </div>

            {/* WhatsApp panel */}
            <aside className="lg:col-span-2">
              <div className="sticky top-28 border border-stone-200 bg-[#F4F1EE] p-10 dark:border-stone-700 dark:bg-[#0d1321]">
                <div className="flex items-center gap-3">
                  <MessageCircle
                    aria-hidden="true"
                    className="h-4 w-4 text-[#25D366]"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Instant Connect
                  </span>
                </div>

                <p className="mt-6 font-serif text-2xl leading-snug text-stone-900 dark:text-stone-100">
                  Prefer a quick chat? Message us on WhatsApp.
                </p>

                <p className="mt-4 text-sm font-light leading-[1.8] text-stone-600 dark:text-stone-300">
                  Share your card size, quantity and finish preferences and
                  we&apos;ll send indicative pricing straight away.
                </p>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-none border border-[#25D366] bg-transparent px-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#25D366] transition-colors duration-300 hover:bg-[#25D366] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0d1321]"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  Chat on WhatsApp
                </button>

                <p className="mt-6 border-t border-stone-200 pt-6 text-[10px] uppercase tracking-[0.25em] text-stone-400 dark:border-stone-700 dark:text-stone-500">
                  Mon - Sat · 9:00 AM - 7:00 PM
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Contact;