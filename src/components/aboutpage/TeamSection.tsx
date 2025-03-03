"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const LeadershipSection = () => {
  interface LeadershipData {
    banner: string;
    heading: string;
    profiles: {
      image: { src: string; alt: string };
      name: string;
      role: string;
      description: string;
      contacts?: {
        phone?: string[];
        email?: string;
      };
    }[];
  }
  
  const [leadershipData, setLeadershipData] = useState<LeadershipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leadership data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/aboutpage/leadership");
        if (!res.ok) {
          throw new Error("Failed to fetch leadership data");
        }
        const data = await res.json();
        setLeadershipData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Common curtain transition settings for all images
  const curtainTransition = {
    duration: 1.2,
    ease: [0.645, 0.045, 0.355, 1],
    delay: 0.4,
  };

  if (isLoading || !leadershipData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inline Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {leadershipData.banner}
          </div>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-12"
        >
          {leadershipData.heading}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipData.profiles.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px", once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 bg-zinc-100">
                <motion.div
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ margin: "-100px", once: true }}
                  transition={curtainTransition}
                  className="absolute inset-0 bg-amber-600 origin-top z-20"
                />
                <Image
                  src={profile.image.src}
                  alt={profile.image.alt}
                  fill
                  className="object-cover z-10"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">
                    {profile.name}
                  </h3>
                  <p className="text-amber-600 font-medium mb-4">
                    {profile.role}
                  </p>
                  <p className="text-zinc-600 mb-4">
                    {profile.description}
                  </p>
                </div>
                {profile.contacts && (
                  <div className="mt-auto space-y-3 text-zinc-600">
                    {profile.contacts.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-amber-600" />
                        <div className="flex gap-1.5">
                          {profile.contacts.phone.map((phone, i) => (
                            <span key={i}>
                              <a
                                href={`tel:${phone.replace(/\s+/g, "")}`}
                                className="hover:text-amber-600 transition-colors duration-300"
                              >
                                {phone}
                              </a>
                              {i < ((profile.contacts?.phone?.length ?? 0) - 1) && <span>,</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.contacts.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-amber-600" />
                        <a
                          href={`mailto:${profile.contacts.email}`}
                          className="hover:text-amber-600 transition-colors duration-300"
                        >
                          {profile.contacts.email}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
