"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroData {
  background: {
    image: string;
    alt: string;
  };
  content: {
    badge: string;
    mainTitle: string;
    highlightText: string;
    description: string;
    button: {
      text: string;
      link: string;
    };
  };
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("/api/aboutpage/herosection");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setHeroData(data);
      } catch (err) {
        setError("Failed to load hero section content");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="animate-pulse bg-gray-200/50 w-full h-full" />
      </div>
    );
  }

  if (error || !heroData) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center text-red-500">
        {error || "Failed to load hero section"}
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroData.background.image})` }}
      />

      {/* Curtain Reveal Effect */}
      <motion.div
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{
          duration: 1.5,
          ease: [0.645, 0.045, 0.355, 1],
          delay: 0.2,
        }}
        className="absolute inset-0 bg-zinc-950 origin-top z-20"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
        >
          {heroData.content.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {heroData.content.mainTitle}{" "}
          <span className="relative inline-block">
            {heroData.content.highlightText}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 2.3 }}
              className="absolute bottom-0 left-0 h-0.5 bg-white/30"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {heroData.content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="flex gap-4"
        >
          <Link
            href={heroData.content.button.link}
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-transform duration-300 ease-out hover:scale-105"
          >
            <span className="relative z-20 font-medium tracking-wide">
              {heroData.content.button.text}
            </span>
            <motion.div
              initial={false}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 z-10 bg-white/20"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;