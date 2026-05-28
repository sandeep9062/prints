"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  event: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya & Rahul",
    event: "Wedding, Mumbai",
    content:
      "The wedding cards were absolutely stunning! Every guest complimented the beautiful design and premium quality. Samlason made our special day even more memorable.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 2,
    name: "Anjali Sharma",
    event: "Corporate Event, Delhi",
    content:
      "Professional service and exceptional quality. The brochures and visiting cards helped elevate our brand image significantly. Highly recommended!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 3,
    name: "Vikram & Sneha",
    event: "Wedding, Bangalore",
    content:
      "We were amazed by the attention to detail and the beautiful finish. The customization options helped us create the perfect invitation for our wedding.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-[#FCFBF9] dark:bg-[#0f111a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of happy couples and businesses who trust Samlason
            for their premium printing needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card-elegant p-8 relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Using next/image for better optimization */}
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.event}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
