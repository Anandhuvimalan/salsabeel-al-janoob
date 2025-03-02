"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Image from "next/image";

interface ExplanationProps {
  header: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  shutters?: number; // Number of vertical shutter elements, defaults to 5
}

const Explanation: React.FC<ExplanationProps> = ({
  header,
  paragraphs,
  imageSrc,
  imageAlt,
  shutters = 5,
}) => {
  const controls = useAnimation();
  const textControls = useAnimation();
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  const isInView = useInView(sectionRef, { once: true });
  const isTextInView = useInView(textRef, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (isTextInView) {
      textControls.start("visible");
    }
  }, [isTextInView, textControls]);

  // Text animation variants with gentler staggering
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.2, 0.05, 0.2, 1],
      },
    },
  };

  // Shutter animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const shutterVariants = {
    hidden: { height: "100%", top: 0 },
    visible: {
      height: "0%",
      transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            ref={textRef}
            className="md:w-1/2 overflow-hidden"
            initial="hidden"
            animate={textControls}
            variants={textContainerVariants}
          >
            <motion.div className="overflow-hidden">
              <motion.h2 variants={textItemVariants} className="text-4xl font-bold mb-6">
                {header}
              </motion.h2>
            </motion.div>
            {paragraphs.map((para, index) => (
              <motion.div key={index} className="overflow-hidden">
                <motion.p variants={textItemVariants} className="text-lg text-gray-700 mb-6">
                  {para}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <div ref={sectionRef} className="md:w-1/2 relative overflow-hidden">
            <motion.div
              className="relative"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              <div className="relative w-full h-full">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl relative z-10"
                />

                {/* Vertical shutters */}
                {Array.from({ length: shutters }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute top-0 bg-gray-50 z-20"
                    style={{
                      left: `${(index * 100) / shutters}%`,
                      width: `${100 / shutters}%`,
                      height: "100%",
                    }}
                    variants={shutterVariants}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explanation;
