"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ValuesData {
  banner: string;
  sectionHeading: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const ValuesSection = () => {
  const [valuesData, setValuesData] = useState<ValuesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/aboutpage/values");
        if (!res.ok) throw new Error("Failed to fetch values data");
        const data = await res.json();
        setValuesData(data);
      } catch (error) {
        console.error("Error fetching values data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading || !valuesData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inline-banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {valuesData.banner}
          </div>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-12"
        >
          {valuesData.sectionHeading}
        </motion.h2>

        {/* Values Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {valuesData.values.map((value) => (
            <div
              key={value.title}
              className="bg-white p-6 rounded-xl border border-zinc-100 hover:border-amber-100 hover:bg-amber-50/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Image
                    src={value.icon}
                    alt={`${value.title} icon`}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
