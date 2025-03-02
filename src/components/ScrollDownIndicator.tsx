"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ScrollDownIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Add scroll event listener to hide the indicator when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      // Hide the indicator when scroll position is more than 50px from top
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation variants for the container
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        delay: 4.5, // Appear after other animations complete
        duration: 0.8
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.5
      }
    }
  };

  // Animation variants for the mouse/scroll icon
  const scrollIconVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  // Animation variants for the dot/wheel
  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, 12, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the arrows
  const arrowVariants = {
    initial: { opacity: 0, y: -5 },
    animate: (custom: number) => ({
      opacity: [0, 1, 0],
      y: [0, 10, 20],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        delay: custom * 0.2
      }
    })
  };

  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      aria-label="Scroll down for more content"
    >
      {/* Mouse/scroll outline */}
      <motion.div
        className="w-6 h-10 rounded-full border-2 border-white/60 flex justify-center p-1 mb-2"
        variants={scrollIconVariants}
        initial="initial"
        animate="animate"
      >
        {/* Scrolling dot */}
        <motion.div
          className="w-1.5 h-1.5 bg-white rounded-full"
          variants={dotVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Animated arrows */}
      <div className="flex flex-col items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={arrowVariants}
            custom={i}
            initial="initial"
            animate="animate"
            className="text-white/80 text-xs"
          >
            ↓
          </motion.div>
        ))}
      </div>
      
      {/* Optional text indicator */}
      <motion.span 
        className="text-xs text-white/70 font-medium tracking-wide mt-2"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.7, 1, 0.7],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }
        }}
      >
        Scroll
      </motion.span>
    </motion.div>
  );
};

export default ScrollDownIndicator;