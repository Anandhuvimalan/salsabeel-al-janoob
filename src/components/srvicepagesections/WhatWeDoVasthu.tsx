"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { FaCompass, FaHome, FaBalanceScale, FaHands, FaSeedling, FaRegLightbulb } from "react-icons/fa"
import { GiSpiralShell, GiLightningTree } from "react-icons/gi"

const MandalaBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <GiSpiralShell className="w-[800px] h-[800px] text-amber-100/50" />
      </motion.div>
    </div>
  )
}

const VasthuServiceCard = ({ service, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay } }
      }}
      initial="hidden"
      animate={controls}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white rounded-3xl transform group-hover:scale-105 transition-all duration-300 shadow-lg" />
      
      <div className="relative p-8 h-full">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-amber-500 text-white flex items-center justify-center transform group-hover:-rotate-12 transition-all">
          {service.icon}
        </div>
        <h3 className="text-2xl font-bold text-zinc-800 mb-4">{service.title}</h3>
        <p className="text-zinc-600 leading-relaxed">{service.description}</p>
        
        <div className="mt-6 pt-4 border-t border-amber-100/50">
          <ul className="space-y-2">
            {service.details.map((detail, i) => (
              <li key={i} className="flex items-center text-sm text-amber-800">
                <GiLightningTree className="mr-2 text-amber-500 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

const EnergyFlowDiagram = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeInOut" }
      })
    }
  }, [isInView, controls])

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={ref}>
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        <motion.path
          d="M200 50 Q 300 100 350 200 T 200 350 Q 100 300 50 200 T 200 50"
          fill="none"
          stroke="#FCD34D"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
          className="opacity-50"
        />
        
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {[0, 90, 180, 270].map((rotate, i) => (
            <motion.g key={i} transform={`rotate(${rotate} 200 200)`}>
              <motion.path
                d="M200 50 L 200 70"
                stroke="#D97706"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={controls}
              />
              <motion.circle
                cx="200"
                cy="50"
                r="4"
                fill="#D97706"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  )
}

const VasthuWhatWeDo = () => {
  const services = [
    {
      icon: <FaCompass className="w-8 h-8" />,
      title: "Directional Analysis",
      description: "Precise alignment assessment using ancient Vasthu principles combined with modern geospatial technology",
      details: ["Cardinal direction optimization", "Energy flow mapping", "Site orientation analysis"]
    },
    {
      icon: <FaHome className="w-8 h-8" />,
      title: "Space Planning",
      description: "Harmonious layout design that balances functionality with positive energy flow",
      details: ["Room placement strategy", "Furniture positioning", "Circulation path optimization"]
    },
    {
      icon: <FaBalanceScale className="w-8 h-8" />,
      title: "Element Balancing",
      description: "Creating perfect harmony between natural elements within your space",
      details: ["Five-element equilibrium", "Material selection guidance", "Color scheme balancing"]
    },
    {
      icon: <FaHands className="w-8 h-8" />,
      title: "Remedial Solutions",
      description: "Custom corrections for existing structural challenges",
      details: ["Energy block removal", "Architectural adjustments", "Vasthu-compliant renovations"]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-amber-50 relative overflow-hidden">
      <MandalaBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4">
            Harmonizing Spaces with <span className="text-amber-600">Vasthu Wisdom</span>
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-28">
          {services.map((service, index) => (
            <VasthuServiceCard
              key={index}
              service={service}
              delay={index * 0.15}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <EnergyFlowDiagram />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <FaSeedling className="text-amber-600 w-12 h-12" />
              <h3 className="text-3xl font-bold text-zinc-800">Holistic Energy Optimization</h3>
              <p className="text-zinc-600 leading-relaxed">
                Our approach combines traditional Vasthu principles with modern environmental psychology to create spaces that 
                nurture both physical well-being and spiritual growth. We analyze 32 distinct energy parameters to ensure 
                perfect cosmic alignment.
              </p>
            </div>

            <div className="space-y-4">
              <FaRegLightbulb className="text-amber-600 w-12 h-12" />
              <h3 className="text-3xl font-bold text-zinc-800">Modern Application of Ancient Science</h3>
              <p className="text-zinc-600 leading-relaxed">
                While rooted in 5,000-year-old Vedic traditions, our consultations incorporate contemporary design 
                aesthetics and structural engineering principles. This fusion creates spaces that are both 
                energetically balanced and functionally modern.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VasthuWhatWeDo