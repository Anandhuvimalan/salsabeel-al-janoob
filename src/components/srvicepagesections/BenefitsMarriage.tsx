"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Smile, Home, Brain, Battery, Star } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Stronger Relationships",
      description: "Build deeper connections and lasting bonds with your loved ones through improved communication and understanding.",
      stats: "94% of couples report improved relationship satisfaction"
    },
    {
      icon: <Smile className="w-6 h-6" />,
      title: "Enhanced Well-being",
      description: "Experience greater emotional stability and personal happiness as you learn effective coping strategies.",
      stats: "87% report reduced stress and anxiety"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Harmonious Home",
      description: "Create a more peaceful and supportive home environment where every family member can thrive.",
      stats: "91% notice improved home atmosphere"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Better Decision Making",
      description: "Develop skills for making thoughtful choices that benefit both individual growth and family unity.",
      stats: "89% make more confident decisions"
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: "Increased Resilience",
      description: "Build the strength to navigate life's challenges together while maintaining strong family bonds.",
      stats: "93% feel better equipped for challenges"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Personal Growth",
      description: "Discover and nurture individual potential while contributing to family harmony.",
      stats: "88% report personal improvement"
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Family's <span className="text-rose-600">Journey</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the lasting positive changes that professional counseling can bring to your family life
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    {benefit.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{benefit.description}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: benefit.stats.split('%')[0] + '%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-0 left-0 h-full bg-rose-400 rounded-full"
                      />
                    </div>
                    <span className="ml-3 text-sm font-medium text-rose-600">
                      {benefit.stats}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-rose-100 via-rose-50 to-rose-100 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take the first step towards a stronger, happier family life with our experienced counselors.
            </p>
            <button className="bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium">
              Schedule a Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;