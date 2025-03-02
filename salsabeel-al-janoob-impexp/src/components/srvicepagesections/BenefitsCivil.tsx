"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FaBuilding, FaHardHat, FaRegClock, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import { GiCrane, GiProgression } from "react-icons/gi";

export default function CivilBenefits() {
  // State to hold the generated circle positions (client-side only)
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const generatedCircles = Array.from({ length: 100 }).map(() => ({
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
    }));
    setCircles(generatedCircles);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/20 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose <span className="text-amber-600">Our Civil Expertise</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Timeline */}
          <div className="space-y-12 relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-amber-100/50 rounded-full" />
            
            {timelineItems.map((item, index) => (
              <motion.div 
                key={index}
                className="relative pl-20"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Stats */}
          <motion.div 
            className="bg-amber-600 text-white p-8 rounded-2xl shadow-xl h-fit sticky top-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div className="text-center">
                <GiCrane className="h-12 w-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">250+</div>
                <p className="text-amber-100">Projects Completed</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon={<FaRegClock className="h-6 w-6" />}
                  title="On-Time Delivery"
                  value="98%"
                />
                <StatCard 
                  icon={<FaDollarSign className="h-6 w-6" />}
                  title="Cost Efficiency"
                  value="40%"
                />
                <StatCard 
                  icon={<FaShieldAlt className="h-6 w-6" />}
                  title="Safety Record"
                  value="100%"
                />
                <StatCard 
                  icon={<GiProgression className="h-6 w-6" />}
                  title="Growth Rate"
                  value="35%"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Construction Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          style={{ 
            backgroundSize: "50px 50px",
            backgroundImage: `linear-gradient(to right, #d9770633 1px, transparent 1px),
                              linear-gradient(to bottom, #d9770633 1px, transparent 1px)`
          }}
        >
          {circles.map((circle, i) => (
            <motion.circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r="1"
              fill="#d97706"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: circle.delay }}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

const StatCard = ({ icon, title, value }) => (
  <motion.div 
    className="bg-amber-700/20 p-4 rounded-xl text-center"
    whileHover={{ y: -5 }}
    viewport={{ once: true }}
  >
    <div className="text-amber-200 mb-2">{icon}</div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <p className="text-sm text-amber-100">{title}</p>
  </motion.div>
);

const timelineItems = [
  {
    icon: <FaBuilding className="h-6 w-6" />,
    title: "Full-Service Expertise",
    description: "From concept to completion - comprehensive civil contracting solutions",
  },
  {
    icon: <FaHardHat className="h-6 w-6" />,
    title: "Quality Assurance",
    description: "Rigorous quality control processes and industry-leading standards",
  },
  {
    icon: <GiCrane className="h-6 w-6" />,
    title: "Modern Equipment",
    description: "State-of-the-art machinery and technology for efficient execution",
  },
  {
    icon: <FaShieldAlt className="h-6 w-6" />,
    title: "Safety First",
    description: "Zero-compromise safety protocols for all site operations",
  },
];
