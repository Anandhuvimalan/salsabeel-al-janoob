"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type ProcessStep = {
  title: string;
  description: string;
  iconSrc: string;
  hoverFrom: string;
  hoverTo: string;
  iconFrom: string;
  iconTo: string;
};

type ProcessData = {
  section: {
    heading: string;
    description: string;
    buttonLink: string;
    buttonText: string;
  };
  steps: ProcessStep[];
};

const ProcessStepCard = ({
  title,
  description,
  iconSrc,
  delay,
  hoverFrom,
  hoverTo,
  iconFrom,
  iconTo
}: {
  title: string;
  description: string;
  iconSrc: string;
  delay: number;
  hoverFrom: string;
  hoverTo: string;
  iconFrom: string;
  iconTo: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-colors duration-300 hover:bg-gradient-to-br ${hoverFrom} ${hoverTo} hover:text-white`}
    >
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-full mb-6 transition-colors duration-300 bg-gradient-to-br ${iconFrom} ${iconTo} group-hover:bg-white`}
      >
        <img
          src={iconSrc}
          alt={title}
          className="w-8 h-8 transition-colors duration-300 brightness-0 invert"
        />
      </div>
      <h3 className="text-2xl font-bold mb-3 group-hover:text-white">{title}</h3>
      <p className="text-gray-600 group-hover:text-white">{description}</p>
    </motion.div>
  );
};

export default function ImportExportProcess() {
  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const res = await fetch("/api/homepage/process");
        if (!res.ok) throw new Error("Failed to fetch process data");
        const data: ProcessData = await res.json();
        setProcessData(data);
      } catch (error) {
        console.error("Error fetching process data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!processData) {
    return (
      <div className="text-center text-red-500 py-20">
        <p>Failed to load process data.</p>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            {processData.section.heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {processData.section.description}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {processData.steps.map((step, index) => (
            <ProcessStepCard
              key={index}
              title={step.title}
              description={step.description}
              iconSrc={step.iconSrc}
              delay={index * 0.1}
              hoverFrom={step.hoverFrom}
              hoverTo={step.hoverTo}
              iconFrom={step.iconFrom}
              iconTo={step.iconTo}
            />
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href={processData.section.buttonLink}
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            {processData.section.buttonText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
