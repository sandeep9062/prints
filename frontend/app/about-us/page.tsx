"use client";

import { FC } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Leaf,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import SocialMediaLinks from "@/components/SocialMediaLinks";
import AboutUs from "@/components/about/AboutUs";
import PageHeader from "@/components/editorial/PageHeader";
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
    icon: Target,
    title: "Quality First",
    description:
      "We never compromise on quality. Every print undergoes rigorous checks before dispatch.",
  },
  {
    icon: Users,
    title: "Customer Devotion",
    description:
      "Your satisfaction is our priority. We go above and beyond to make your vision a reality.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description:
      "We use sustainable papers and responsible printing practices wherever possible.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We understand the importance of timelines and ensure on-time dispatch every time.",
  },
];

const principles = [
  {
    title: "Our Mission",
    icon: Target,
    copy: "To transform special moments into lasting memories through exceptional craftsmanship and personalised service.",
  },
  {
    title: "Our Vision",
    icon: Users,
    copy: "To be the most trusted and innovative printing partner in India, crafting prints that bring joy and evoke cherished memories.",
  },
];

const About: FC = () => {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  return (
    <div className="min-h-screen bg-[#FCFBF9] dark:bg-[#0f111a]">
      <SEOHelper
        title="About Us – Samlason Printing Press Since 2004"
        description="Learn about Samlason Printing Press – over 20 years of premium printing excellence in Panchkula. Wedding cards, visiting cards, brochures & more with quality craftsmanship."
        path="/about-us"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="about printing press, Samlason Printing, Panchkula printing history, 2004 printing, premium printing India"
        jsonLd={breadcrumbSchema}
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)]">
        {/* ───────── Page header ───────── */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <PageHeader
              eyebrow="Est. 2004 — Panchkula"
              title="Our Story,"
              accent="Two Decades of Craft"
              description="For over two decades, Samlason Printing has been transforming special moments into timeless keepsakes through the art of premium printing — pressed, foiled and finished under one roof."
            >
              <SocialMediaLinks />
            </PageHeader>
          </div>
        </section>

        {/* ───────── Stats strip ───────── */}
        <section className="bg-stone-900 py-14 text-white dark:bg-[#0d1321]">
          <div className="container mx-auto px-6">
            <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={
                    i > 0
                      ? "border-l border-white/15 pl-6 md:pl-8"
                      : undefined
                  }
                >
                  <dd className="font-serif text-4xl font-light uppercase tabular-nums md:text-5xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
{/* ───────── Story ───────── */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Editorial image stack */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 hidden h-full w-full border border-red-200 sm:block dark:border-red-800/70"
                />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <img
                        src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80"
                        alt="Printing workshop"
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover grayscale-[20%]"
                      />
                    </div>
                    <div className="overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <img
                        src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80"
                        alt="Paper samples"
                        loading="lazy"
                        className="aspect-square w-full object-cover grayscale-[20%]"
                      />
                    </div>
                  </div>
                  <div className="overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img
                      src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400&q=80"
                      alt="Wedding cards pressed in-house"
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[20%]"
                    />
                  </div>
                </div>
              </div>
{/* Copy */}
              <div className="space-y-7">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-10 bg-red-800 dark:bg-red-600"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Since 2004
                  </span>
                </div>

                <h2 className="font-serif text-4xl leading-tight text-stone-900 md:text-5xl dark:text-stone-100">
                  A Legacy of
                  <br />
                  <em className="font-light text-red-800 dark:text-red-600">
                    Excellence in Print
                  </em>
                </h2>

                <div className="space-y-5 text-base font-light leading-[1.9] text-stone-600 dark:text-stone-300">
                  <p>
                    Samlason Printing was founded with a simple yet powerful
                    vision: to create printed materials that capture the essence
                    of life&apos;s most precious moments.
                  </p>
                  <p>
                    Our journey began with wedding invitations, and over the
                    years we have expanded into a wide range of printing
                    solutions — from visiting cards to complex brochures.
                  </p>
                  <p>
                    Today we serve thousands of customers across India, treating
                    every order with personal care. Because every print tells a
                    story, and every story deserves to be told beautifully.
                  </p>
                </div>

                <blockquote className="border-l-2 border-stone-200 pl-5 text-sm italic text-stone-500 dark:border-stone-700 dark:text-stone-400">
                  &ldquo;No middlemen. No compromise.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Mission & Vision ───────── */}
        <section className="bg-[#F4F1EE] py-24 dark:bg-[#0d1321]">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 md:grid-cols-2">
              {principles.map(({ title, icon: Icon, copy }) => (
                <div
                  key={title}
                  className="border border-stone-200 bg-[#FCFBF9] p-10 dark:border-stone-800 dark:bg-[#0f111a]"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 text-red-800 dark:text-red-600"
                    />
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-6 font-serif text-2xl leading-snug text-stone-900 md:text-3xl dark:text-stone-100">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AboutUs />
{/* ───────── Core values ───────── */}
        <section className="bg-[#FCFBF9] py-24 dark:bg-[#0f111a]">
          <div className="container mx-auto px-6">
            <div className="mb-14 flex flex-col justify-between gap-6 border-b border-stone-200 pb-6 md:flex-row md:items-end dark:border-stone-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
                  What We Stand For
                </span>
                <h2 className="mt-2 font-serif text-4xl text-stone-900 md:text-5xl dark:text-stone-100">
                  Our Core{" "}
                  <em className="font-light text-red-800 dark:text-red-600">
                    Values
                  </em>
                </h2>
              </div>
              <p className="max-w-xs text-sm italic text-stone-500 md:mt-0 dark:text-stone-400">
                The standards we hold every job to, from first proof to dispatch.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="group">
                  <div className="flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-500 transition-colors duration-300 group-hover:border-red-900 group-hover:text-red-900 dark:border-stone-700 dark:text-stone-400 dark:group-hover:border-red-600 dark:group-hover:text-red-600">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <h3 className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-stone-900 dark:text-stone-100">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-[1.8] text-stone-500 dark:text-stone-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="bg-stone-900 py-24 text-white dark:bg-[#0d1321]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-white/25" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
                  Bespoke Services
                </span>
                <span aria-hidden="true" className="h-px w-10 bg-white/25" />
              </div>

              <h2 className="mt-8 font-serif text-4xl leading-tight md:text-5xl">
                Let&apos;s Print
                <br />
                <em className="font-light text-red-500">Something Lasting.</em>
              </h2>

              <p className="mt-6 max-w-xl text-base font-light leading-[1.8] text-white/60">
                Walk into our Panchkula studio or start online — from the first
                sketch to the final emboss, we partner with you.
              </p>

              <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                <Link
                  href="/customize"
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-none bg-red-900 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Begin Customization
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-none border border-white/25 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
                >
                  Visit the Studio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;