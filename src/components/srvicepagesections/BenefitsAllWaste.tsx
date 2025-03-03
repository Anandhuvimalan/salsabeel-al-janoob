"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaPiggyBank, 
  FaHandshake, 
  FaChartLine, 
  FaShieldAlt, 
  FaClock 
} from 'react-icons/fa';

const BenefitCard = ({ icon: Icon, title, description, highlights }) => {
  return (
    <motion.div 
      className="relative bg-white rounded-2xl p-8 shadow-lg"
      whileHover={{ y: -10, scale: 1.03, boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 ml-4">{title}</h3>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      <div className="space-y-3">
        {highlights.map((highlight, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
          >
            <div className="h-2 w-2 bg-purple-500 rounded-full mr-3" />
            <span className="text-gray-700">{highlight}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const WasteManagementBenefits = () => {
  const benefits = [
    {
      icon: FaPiggyBank,
      title: "Cost Efficiency",
      description: "Optimize your waste management costs with our efficient solutions and transparent pricing.",
      highlights: [
        "Reduced disposal costs through recycling",
        "Optimized collection schedules",
        "Volume-based pricing options"
      ]
    },
    {
      icon: FaLeaf,
      title: "Environmental Impact",
      description: "Make a positive impact on the environment with our sustainable waste management practices.",
      highlights: [
        "Reduced carbon footprint",
        "Increased recycling rates",
        "Sustainable disposal methods"
      ]
    },
    {
      icon: FaHandshake,
      title: "Reliable Partnership",
      description: "Experience peace of mind with our dependable waste management services and support.",
      highlights: [
        "Dedicated account manager",
        "24/7 customer support",
        "Flexible service agreements"
      ]
    },
    {
      icon: FaChartLine,
      title: "Performance Tracking",
      description: "Monitor and optimize your waste management with detailed analytics and reporting.",
      highlights: [
        "Real-time waste tracking",
        "Monthly performance reports",
        "Waste reduction insights"
      ]
    },
    {
      icon: FaShieldAlt,
      title: "Compliance & Safety",
      description: "Stay compliant with all regulatory requirements while ensuring safe waste handling.",
      highlights: [
        "Full regulatory compliance",
        "Safety protocol adherence",
        "Regular audits & certifications"
      ]
    },
    {
      icon: FaClock,
      title: "Time Savings",
      description: "Save valuable time with our streamlined waste management processes and solutions.",
      highlights: [
        "Automated scheduling",
        "Quick response times",
        "Simplified waste sorting"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our <span className="text-purple-600">Waste Management</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the advantages of working with a leading waste management provider committed to efficiency, sustainability, and customer satisfaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WasteManagementBenefits;
