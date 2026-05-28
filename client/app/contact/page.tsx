"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

const Contact = () => {
  const { mainOffice, contactNo1, email, whatsAppNo } = useSiteSettings();

  const contactInfo = [
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
    },
    {
      icon: Mail,
      title: "Email Us",
      details: email ? [email] : ["info@samlason.com"],
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
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="Contact Us – Samlason Printing Press, Panchkula"
        description="Get in touch with Samlason Printing Press. Call, email, or visit us in Panchkula for premium wedding cards, visiting cards, brochures & custom printing."
        path="/contact"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="contact printing press, Samlason Printing contact, Panchkula printing press, custom printing inquiry"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16 bg-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
                Get in Touch
              </h1>
              <p className="text-muted-foreground mb-4">
                Have questions or need help with your order? We'd love to hear
                from you. Our team is always ready to assist.
              </p>
            </div>
            <SocialMediaLinks />
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item) => (
                <div key={item.title} className="card-elegant p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form Section */}
              <div className="card-elegant p-8">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      name="message"
                      placeholder="Tell us about your requirements..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                {/* WhatsApp Button */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Or connect with us instantly
                  </p>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={openWhatsApp}
                    className="bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>

              {/* Google Map */}
              <div>
                <div className="card-elegant overflow-hidden h-[400px] lg:h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18..."
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Samlason Printing Location"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SocialMediaLinks />
    </div>
  );
};

export default Contact;
