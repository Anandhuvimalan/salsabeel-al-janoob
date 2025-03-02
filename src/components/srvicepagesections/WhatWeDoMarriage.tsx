"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Heart, Users, Brain, Sparkles, MessageCircle, Shield } from "lucide-react";

const ServicesSection = () => {
  const serviceCategories = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Relationship Enhancement",
      description: "Strengthen your bond through proven communication techniques and emotional connection exercises.",
      benefits: ["Deeper emotional intimacy", "Better conflict resolution", "Enhanced mutual understanding"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Dynamics",
      description: "Navigate complex family relationships and create a more harmonious home environment.",
      benefits: ["Improved parent-child relationships", "Effective co-parenting strategies", "Stronger family bonds"]
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Personal Growth",
      description: "Develop individual strengths while building a stronger foundation for your relationships.",
      benefits: ["Enhanced self-awareness", "Better emotional regulation", "Increased resilience"]
    }
  ];

  const approaches = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Support",
      description: "Every family's journey is unique. We tailor our approach to your specific needs and goals."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Open Dialogue",
      description: "Create a safe space for honest communication and meaningful conversations."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust Building",
      description: "Rebuild and strengthen trust through guided exercises and proven techniques."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Services */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Nurturing Relationships, Building <span className="text-rose-600">Stronger Futures</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1 bg-rose-400 mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Our Approach */}
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-rose-100 rounded-3xl p-8 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Therapeutic Approach</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine evidence-based methods with compassionate care to help you achieve lasting positive change.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approaches.map((approach, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur rounded-xl p-6"
              >
                <div className="text-rose-600 mb-4">{approach.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{approach.title}</h4>
                <p className="text-gray-600">{approach.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;