"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollDownIndicator from "./ScrollDownIndicator"; 

// Define the expected structure of the hero data
type HeroSectionData = {
  tag: string;
  title: string;
  highlightedTitle: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  animationSettings: {
    cycleDuration: number;
    animationDuration: number;
    initialRevealDelay: number;
  };
  images: {
    src: string;
    alt: string;
  }[];
};

export default function HeroSection() {
  const [data, setData] = useState<HeroSectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [initialRevealComplete, setInitialRevealComplete] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch hero data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/homepage/section1/heroSection");
        if (!res.ok) {
          throw new Error("Failed to fetch hero data");
        }
        const heroData = await res.json();
        setData(heroData as HeroSectionData);
      } catch (error) {
        console.error(error);
        // Fallback data in case the API call fails
        setData({
          tag: "Global Trade Solutions",
          title: "Connecting",
          highlightedTitle: "Businesses Worldwide",
          description: "Streamline your international trade operations with our comprehensive suite of services designed for modern businesses.",
          buttonName: "Explore Services",
          buttonLink: "/services",
          animationSettings: {
            cycleDuration: 6000,
            animationDuration: 1500,
            initialRevealDelay: 500
          },
          images: [
            {
              src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              alt: "Global shipping containers at port"
            },
            {
              src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              alt: "International business meeting"
            },
            {
              src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
              alt: "Digital trade analytics dashboard"
            }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate the next image index
  const nextImageIndex = useMemo(() => {
    if (!data?.images?.length) return 0;
    return (currentImageIndex + 1) % data.images.length;
  }, [currentImageIndex, data?.images?.length]);

  // Handle image cycling and curtain effect
  useEffect(() => {
    if (!initialRevealComplete || !data?.images || data.images.length <= 1) return;

    const { cycleDuration, animationDuration } = data.animationSettings;

    const cycleImages = () => {
      setIsAnimating(true);
      animationTimerRef.current = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length);
        setIsAnimating(false);
        cycleTimerRef.current = setTimeout(cycleImages, cycleDuration - animationDuration);
      }, animationDuration);
    };

    cycleTimerRef.current = setTimeout(cycleImages, 1000);
    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [initialRevealComplete, data]);

  // Handle initial reveal delay
  useEffect(() => {
    if (!data) return;

    const initialTimer = setTimeout(() => {
      setInitialRevealComplete(true);
    }, data.animationSettings.initialRevealDelay + 3000); // Extended delay for the full curtain animation

    return () => clearTimeout(initialTimer);
  }, [data]);

  // Animation variants for text
  const textAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: delay + 2 } // Increased delay to account for longer curtain animation
    })
  };

  // Much smoother initial curtain animation
  const initialCurtainVariants = {
    initial: { 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    },
    animate: { 
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      transition: {
        duration: 2.8,
        ease: [0.25, 0.1, 0.25, 1], // Smoother cubic-bezier curve
        delay: 1
      }
    }
  };

  if (isLoading || !data) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[10000] overflow-hidden flex items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          {/* Loading Text */}
          <div className="text-white text-2xl mt-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative h-screen overflow-hidden" 
      aria-label="Hero section showcasing global trade services"
    >
      {/* Much smoother initial curtain animation */}
      <AnimatePresence>
        {!initialRevealComplete && (
          <motion.div
            className="absolute inset-0 z-50 bg-black"
            variants={initialCurtainVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 2.8 }}
          />
        )}
      </AnimatePresence>

      {/* Image Layers */}
      <div className="absolute inset-0">
        {/* Next image (preloaded) */}
        <div className="absolute inset-0 z-0">
          <img
            src={data.images[nextImageIndex]?.src || ""}
            alt={data.images[nextImageIndex]?.alt || ""}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Current image with curtain animation */}
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentImageIndex} 
            className="absolute inset-0 z-1"
            initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            animate={{
              clipPath: isAnimating
                ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }}
            transition={{
              duration: data.animationSettings.animationDuration / 1000,
              ease: [0.645, 0.045, 0.355, 1]
            }}
          >
            <img
              src={data.images[currentImageIndex]?.src || ""}
              alt={data.images[currentImageIndex]?.alt || ""}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        <motion.span
          variants={textAnimationVariants}
          custom={1.7}
          initial="hidden"
          animate="visible"
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/15"
        >
          {data.tag}
        </motion.span>

        <motion.h1
          variants={textAnimationVariants}
          custom={1.9}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {data.title}{" "}
          <span className="tracking-extra-wider relative inline-block">
            {data.highlightedTitle}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 4.3 }} // Increased delay
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/10 via-white/60 to-white/10"
            />
          </span>
        </motion.h1>

        <motion.p
          variants={textAnimationVariants}
          custom={2.1}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {data.description}
        </motion.p>

        <motion.div
          variants={textAnimationVariants}
          custom={2.3}
          initial="hidden"
          animate="visible"
        >
          <a
            href={data.buttonLink}
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-all duration-300 ease-out hover:bg-white/95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label={data.buttonName}
          >
            <div className="absolute inset-0 scale-0 bg-white/10 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 transform-gpu" />
            <span className="relative z-20 font-medium tracking-wide">
              {data.buttonName}
            </span>
            {!isHovering && (
              <motion.div
                initial={false}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  times: [0, 0.5, 1],
                  ease: "easeInOut"
                }}
                className="absolute inset-0 z-10 rounded-full bg-white/20"
              />
            )}
          </a>
        </motion.div>

        {data.images.length > 1 && (
          <motion.div 
            variants={textAnimationVariants}
            custom={2.5}
            initial="hidden"
            animate="visible"
            className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-30"
          >
            {data.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-white w-6" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setIsAnimating(true);
                  if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
                  if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
                  animationTimerRef.current = setTimeout(() => {
                    setIsAnimating(false);
                  }, data.animationSettings.animationDuration);
                }}
                aria-label={`View image ${index + 1}`}
                aria-current={index === currentImageIndex ? "true" : "false"}
              />
            ))}
          </motion.div>
        )}
      </div>
      <ScrollDownIndicator />
    </section>
  );
}