"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const VisionMissionSection = () => {
  const [visionMissionData, setVisionMissionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVisionMissionData() {
      try {
        const res = await fetch("/api/aboutpage/visionmission");
        if (!res.ok) {
          throw new Error("Failed to fetch vision & mission data");
        }
        const data = await res.json();
        setVisionMissionData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVisionMissionData();
  }, []);

  if (isLoading || !visionMissionData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative py-20 bg-zinc-50">
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
            {visionMissionData.inlineBanner}
          </div>
        </motion.div>

        {/* Main Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-16"
        >
          {visionMissionData.mainHeading}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-100"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.visionCard.icon}
                  alt="Vision Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-800 mb-4">
              {visionMissionData.visionCard.title}
            </h3>
            <p className="text-zinc-600 text-lg leading-relaxed">
              {visionMissionData.visionCard.description}
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.missionCard.icon}
                  alt="Mission Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-800 mb-6">
              {visionMissionData.missionCard.title}
            </h3>

            <div className="space-y-6">
              {visionMissionData.missionCard.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 text-amber-600">
                      <Image
                        src={item.icon}
                        alt="Mission item icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                  <p className="text-zinc-600">
                    <strong>{item.strongText} </strong>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
