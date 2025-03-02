"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CallToAction = () => {
  const [callToActionData, setCallToActionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/aboutpage/calltoaction");
        if (!res.ok) {
          throw new Error("Failed to fetch call-to-action data");
        }
        const data = await res.json();
        setCallToActionData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading || !callToActionData) return <div>Loading...</div>;

  return (
    <section className="py-16 bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {callToActionData.heading}
          </h2>
          <p className="text-lg text-white md:text-xl">
            {callToActionData.subheading}
          </p>
          <div className="mt-8">
            <Link
              href={callToActionData.buttonLink}
              className="inline-block px-8 py-3 bg-white text-amber-600 font-semibold rounded-md shadow hover:bg-gray-100 transition"
            >
              {callToActionData.buttonText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
