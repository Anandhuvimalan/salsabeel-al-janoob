"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  img: string;
  alt: string;
  name: string;
  role: string;
  text: string;
}

interface TestimonialsData {
  header: {
    banner: string;
    title: string;
    subheading: string;
  };
  columns: {
    column1: Testimonial[];
    column2: Testimonial[];
    column3: Testimonial[];
  };
}

const Testimonials = () => {
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/aboutpage/testimonials");
        if (!res.ok) {
          throw new Error("Failed to fetch testimonials data");
        }
        const data = await res.json();
        setTestimonialsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const renderCard = (testimonial: Testimonial) => (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-sm leading-6"
    >
      <div className="relative group">
        <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-amber-300 to-amber-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
        <div className="relative p-6 space-y-6 leading-none rounded-lg bg-white ring-1 ring-zinc-200">
          <div className="flex items-center space-x-4">
            <img
              src={testimonial.img}
              className="w-12 h-12 border rounded-full"
              alt={testimonial.alt}
            />
            <div>
              <h3 className="text-lg font-semibold text-zinc-800">
                {testimonial.name}
              </h3>
              <p className="text-zinc-500">{testimonial.role}</p>
            </div>
          </div>
          <p className="leading-normal text-zinc-600">{testimonial.text}</p>
        </div>
      </div>
    </motion.li>
  );

  if (isLoading || !testimonialsData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-5 md:mb-16 md:text-center"
        >
          <div className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {testimonialsData.header.banner}
          </div>
          <h1 className="mb-5 text-3xl font-bold text-zinc-800 md:text-4xl">
            {testimonialsData.header.title}
          </h1>
          <p className="text-lg text-zinc-600 md:text-xl">
            {testimonialsData.header.subheading}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Column 1 – Always visible */}
          <ul className="space-y-8">
            {testimonialsData.columns.column1.map((testimonial, index) => (
              <React.Fragment key={index}>
                {renderCard(testimonial)}
              </React.Fragment>
            ))}
          </ul>

          {/* Column 2 – Hidden on mobile/tablet */}
          <ul className="space-y-8 hidden lg:block">
            {testimonialsData.columns.column2.map((testimonial, index) => (
              <React.Fragment key={index}>
                {renderCard(testimonial)}
              </React.Fragment>
            ))}
          </ul>

          {/* Column 3 – Hidden on mobile/tablet */}
          <ul className="space-y-8 hidden lg:block">
            {testimonialsData.columns.column3.map((testimonial, index) => (
              <React.Fragment key={index}>
                {renderCard(testimonial)}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
