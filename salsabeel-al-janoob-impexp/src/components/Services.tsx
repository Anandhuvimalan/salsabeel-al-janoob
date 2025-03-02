"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Service = {
  id: number;
  title: string;
  image: string;
  description: string;
  gradient: string;
};

type ServicesData = {
  sectionTitle: string;
  services: Service[];
};

const CoreServices = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);

  // Update isMobile state based on viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch services data from API on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/homepage/services");
        if (!res.ok) throw new Error("Failed to fetch services data");
        const data: ServicesData = await res.json();
        setServicesData(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading || !servicesData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 text-gray-300 py-12 sm:py-16 md:py-20 w-full overflow-hidden">
      <div className="mx-auto px-6 lg:px-10">
        {/* Section heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-16 md:mb-24 text-center text-gray-100 leading-snug md:leading-relaxed">
          {servicesData.sectionTitle}
        </h1>

        {isMobile ? (
          // ------------------- MOBILE VIEW -------------------
          <div className="space-y-0">
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <Link key={service.id} href={url}>
                  <div className="flex items-center border-b border-gray-700 py-4 cursor-pointer">
                    <div className="w-3/4 text-left">
                      <h2 className="text-lg font-bold text-gray-200">
                        {service.title}
                      </h2>
                      <p className="text-sm text-gray-400 leading-tight">
                        {service.description}
                      </p>
                    </div>
                    <div className="w-1/4 flex justify-end items-center">
                      <div
                        className={`relative w-16 h-16 rounded-lg bg-gradient-to-br ${service.gradient}`}
                      >
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // ------------------- DESKTOP VIEW -------------------
          <motion.div
            className="space-y-0"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <motion.div key={service.id} className="overflow-hidden">
                  <Link href={url}>
                    <motion.div
                      className="relative block border-b border-gray-700 py-4 cursor-pointer overflow-hidden h-full rounded-md"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {/* Animated background gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-b ${service.gradient} rounded-md pointer-events-none z-0`}
                        variants={{
                          rest: { scaleY: 0 },
                          hover: {
                            scaleY: 1,
                            transition: { duration: 0.5, ease: "easeOut" },
                          },
                        }}
                        style={{ originY: "bottom" }}
                      />

                      <div className="relative z-10 flex items-center justify-between h-full w-full">
                        {/* Number animation */}
                        <div className="absolute top-0 left-1 flex">
                          <span className="text-gray-400 text-sm font-bold">
                            0
                          </span>
                          <div className="overflow-hidden w-5 h-6">
                            <motion.div
                              variants={{
                                rest: { y: 0 },
                                hover: {
                                  y: -24,
                                  transition: { duration: 0.3, ease: "easeInOut" },
                                },
                              }}
                            >
                              <span className="block h-6 text-gray-400 text-sm font-bold">
                                {service.id}
                              </span>
                              <span className="block h-6 text-gray-400 text-sm font-bold">
                                {service.id}
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Title */}
                        <motion.div
                          className="w-2/4 text-left pl-8"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: 20, transition: { duration: 0.5 } },
                          }}
                        >
                          <h2 className="text-lg font-bold text-gray-200">
                            {service.title}
                          </h2>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          className="w-2/4 text-left"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: 20, transition: { duration: 0.5 } },
                          }}
                        >
                          <p className="text-sm text-gray-300">
                            {service.description}
                          </p>
                        </motion.div>

                        {/* Image container with animated swap */}
                        <motion.div
                          className="w-1/4 flex justify-end"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: -10, transition: { duration: 0.5 } },
                          }}
                        >
                          <div
                            className={`relative w-16 h-16 overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br ${service.gradient}`}
                          >
                            <motion.div
                              className="absolute inset-0 flex flex-col"
                              variants={{
                                rest: { y: 0 },
                                hover: {
                                  y: -64,
                                  transition: { duration: 0.5 },
                                },
                              }}
                              style={{ height: "128px" }}
                            >
                              <div className="relative w-full h-16">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="relative w-full h-16">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CoreServices;
