"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TestimonialItem {
  name: string;
  title: string;
  message: string;
  image: string;
}

interface TestimonialData {
  section: {
    heading: string;
    descriptions: string[];
  };
  testimonials: TestimonialItem[];
}

const Testimonial: React.FC = () => {
  const [data, setData] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/homepage/testimonials");
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10 bg-gray-100">
        Error: {error}
      </div>
    );
  }

  if (!data) return null;

  const {
    section: { heading, descriptions },
    testimonials,
  } = data;

  const totalTestimonials = testimonials.length;
  const containerHeight = `${totalTestimonials * 100}vh`;

  return (
    <div className="w-full bg-gray-100">
      <div className="flex flex-col max-w-7xl px-4 mx-auto lg:flex-row min-h-screen text-gray-800">
        {/* Left Section with animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 h-screen w-full lg:w-1/2 bg-gray-100 p-6 lg:p-10 flex flex-col justify-start items-center lg:justify-center lg:items-start"
        >
          <div className="max-w-xl text-center pl-0 lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 mb-4 md:mb-6">
              {heading}
            </h1>
            {descriptions.map((text, idx) => (
              <p key={idx} className="text-lg text-gray-700 mb-3 md:mb-4">
                {text}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Right Section (Sticky Scrolling Container) */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <div
            className="relative w-full max-w-2xl flex flex-col justify-center px-4"
            style={{ height: containerHeight }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="sticky top-0 h-screen flex items-center justify-center"
                style={{ zIndex: index + 1 }}
              >
                <div className="bg-white rounded-2xl shadow-xl border border-indigo-200 w-96 h-[430px] flex flex-col items-center justify-between p-10 mt-10 md:mt-0 lg:mt-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-200 ring-offset-2">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {/* Removed max-h-48 and overflow-y-auto to eliminate scrolling */}
                  <div className="flex flex-col items-center flex-grow justify-center">
                    <h3 className="text-xl font-semibold text-indigo-600">
                      {testimonial.name}
                    </h3>
                    <blockquote className="text-base leading-relaxed text-gray-600 mt-4 text-center">
                      "{testimonial.message}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
