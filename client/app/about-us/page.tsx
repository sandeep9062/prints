"use client";

import { FC } from "react";
import {
  Award,
  Users,
  Leaf,
  Clock,
  Target,
  Heart,
  LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import AboutUs from "@/components/about/AboutUs";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
interface Stat {
  value: string;
  label: string;
}

interface ValueCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const stats: Stat[] = [
  { value: "20+", label: "Years Experience" },
  { value: "50K+", label: "Happy Customers" },
  { value: "100+", label: "Unique Designs" },
  { value: "500+", label: "Daily Orders" },
];

const values: ValueCard[] = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "We never compromise on quality. Every print undergoes rigorous quality checks before delivery.",
  },
  {
    icon: Heart,
    title: "Customer Love",
    description:
      "Your satisfaction is our priority. We go above and beyond to make your vision a reality.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description:
      "We use sustainable materials and eco-friendly printing practices whenever possible.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We understand the importance of timelines and ensure on-time delivery every single time.",
  },
];

const About: FC = () => {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHelper
        title="About Us – Samlason Printing Press Since 2004"
        description="Learn about Samlason Printing Press – over 20 years of premium printing excellence in Panchkula. Wedding cards, visiting cards, brochures & more with quality craftsmanship."
        path="/about-us"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="about printing press, Samlason Printing, Panchkula printing history, 2004 printing, premium printing India"
        jsonLd={breadcrumbSchema}
      />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-2">
                Our Story
              </h1>
              <p className="text-lg  mb-4 text-muted-foreground leading-relaxed">
                For over two decades, Samlason Printing has been transforming
                special moments into timeless keepsakes through the art of
                premium printing.
              </p>
              <SocialMediaLinks />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-red-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/80 mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80"
                      alt="Printing workshop"
                      className="w-full aspect-[4/5] object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80"
                      alt="Paper samples"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <div className="rounded-2xl overflow-hidden h-full">
                    <img
                      src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
                      alt="Wedding cards"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  Since 2004
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold">
                  A Legacy of Excellence in Print
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Samlason Printing was founded with a simple yet powerful
                    vision: to create printed materials that capture the essence
                    of life's most precious moments.
                  </p>
                  <p>
                    Our journey began with wedding invitations, and over the
                    years, we've expanded to a wide range of printing solutions
                    — from visiting cards to complex brochures.
                  </p>
                  <p>
                    Today, we serve thousands of customers across India, while
                    treating every order with personal care. Because every print
                    tells a story, and every story deserves to be told
                    beautifully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="card-elegant p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To transform special moments into lasting memories through
                  exceptional craftsmanship and personalized service.
                </p>
              </div>

              <div className="card-elegant p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and innovative printing partner in
                  India, crafting prints that bring joy and evoke cherished
                  memories.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AboutUs />
        {/* Values */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-medium text-primary tracking-wider uppercase">
                What We Stand For
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4">
                Our Core Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
