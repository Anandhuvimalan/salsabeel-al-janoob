"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroSectionProps {
  backgroundImage: string;
  serviceType?: string;
  title: string;
  underlineText?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  serviceType,
  title,
  underlineText,
  description,
  buttonText,
  buttonLink,
}) => {
  // Define container variants with staggered children
  const curtainVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Each shutter starts fully covering and then animates up
  const shutterVariants = {
    hidden: { height: "100%" },
    visible: {
      height: "0%",
      transition: { duration: 0.8, ease: [0.645, 0.045, 0.355, 1] },
    },
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Curtain Reveal Effect with Staggered Shutters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={curtainVariants}
        className="absolute inset-0 z-20"
      >
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            variants={shutterVariants}
            className="absolute top-0 bg-zinc-950"
            style={{
              left: `${index * 20}%`,
              width: "20%",
            }}
          />
        ))}
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        {serviceType && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
          >
            {serviceType}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {title}{" "}
          {underlineText && (
            <span className="relative inline-block">
              {underlineText}
              <motion.span
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 2.3 }}
                className="absolute bottom-0 left-0 h-0.5 bg-white/30"
              />
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        >
          <Link
            href={buttonLink}
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-transform duration-300 ease-out hover:scale-105"
          >
            <span className="relative z-20 font-medium tracking-wide">
              {buttonText}
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
