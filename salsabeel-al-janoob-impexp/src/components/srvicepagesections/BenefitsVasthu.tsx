// components/WhyChooseUs.tsx
"use client"

import { motion } from "framer-motion"
import { FaBalanceScale, FaHands } from "react-icons/fa"
import { GiSpiralShell, GiLightningTree } from "react-icons/gi"

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <FaBalanceScale className="w-8 h-8" />,
      title: "5,000+ Years of Wisdom",
      description: "Ancient principles validated through modern scientific studies of spatial energy dynamics",
      bg: "bg-amber-100"
    },
    {
      icon: <GiSpiralShell className="w-8 h-8" />,
      title: "360° Energy Mapping",
      description: "Comprehensive analysis of 32 distinct energy parameters in your space",
      bg: "bg-orange-100"
    },
    {
      icon: <FaHands className="w-8 h-8" />,
      title: "Blended Approach",
      description: "Seamless integration of Vedic knowledge with contemporary architectural practices",
      bg: "bg-yellow-100"
    },
    {
      icon: <GiLightningTree className="w-8 h-8" />,
      title: "Proven Results",
      description: "82% of clients report increased harmony and productivity within 3 months",
      bg: "bg-amber-50"
    }
  ]

  return (
    <section className="py-24 bg-zinc-50 relative overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-[800px] h-[800px] rounded-full border-2 border-amber-100/30" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4">
            Why Our <span className="text-amber-600">Vasthu Solutions</span> Stand Apart
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative group"
            >
              <div className={`${benefit.bg} p-8 rounded-2xl h-full transition-all duration-300 group-hover:shadow-lg`}>
                <div className="w-16 h-16 mb-6 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-800 mb-3">{benefit.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 lg:p-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-amber-500/30 pb-8 md:pb-0">
              <div className="text-4xl font-bold">1500+</div>
              <p className="text-amber-100">Spaces Harmonized</p>
            </div>
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-amber-500/30 pb-8 md:pb-0">
              <div className="text-4xl font-bold">94%</div>
              <p className="text-amber-100">Client Satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">28+</div>
              <p className="text-amber-100">Years Experience</p>
            </div>
          </div>
        </motion.div>

        
      </div>
    </section>
  )
}

export default WhyChooseUs