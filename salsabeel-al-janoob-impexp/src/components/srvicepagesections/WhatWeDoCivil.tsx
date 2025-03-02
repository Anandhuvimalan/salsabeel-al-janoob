"use client"

import { useEffect, useState, useCallback,useRef } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { FaBuilding, FaHammer, FaPaintRoller, FaSolarPanel, FaTree, FaCheckCircle } from "react-icons/fa"
import { GiBrickWall, GiBulldozer, GiElectric } from "react-icons/gi"
import { MdDesignServices, MdFoundation } from "react-icons/md"

const BlueprintBackground = () => {
  const [mounted, setMounted] = useState(false)
  
  // Always call hooks unconditionally at the top level
  const generatePositions = useCallback(() => {
    const positions = []
    const seed = 1 // Fixed seed for consistent generation
    for (let i = 0; i < 50; i++) {
      const random = (multiplier: number) => 
        Math.abs(Math.sin(seed * i * multiplier)) * 100
      positions.push({
        x: random(0.314159),
        y: random(0.618034)
      })
    }
    return positions
  }, []) // Empty dependency array for stable reference

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const positions = generatePositions()

  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
      <svg className="w-full h-full" style={{ 
        backgroundSize: "40px 40px",
        backgroundImage: "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)"
      }}>
        {positions.map((pos, i) => (
          <motion.rect
            key={i}
            x={`${pos.x}%`}
            y={`${pos.y}%`}
            width="40"
            height="40"
            stroke="#3b82f6"
            strokeWidth="1"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 2 + (i % 3), 
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </svg>
    </div>
  )
}
const ServiceCard = ({ service, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="p-4 bg-blue-50 rounded-lg text-blue-600"
            animate={isHovered ? { rotate: 10 } : { rotate: 0 }}
          >
            {service.icon}
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
        </div>

        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
          
          <div className="space-y-2">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-700">
                <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

const ProjectPhase = ({ phase, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 border-l-2 border-blue-200 pb-8 last:pb-0"
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 }
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0 shadow-lg" />
      <div className="flex gap-4 items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mt-1">
          {phase.icon}
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800">{phase.title}</h4>
          <p className="text-gray-600 text-sm">{phase.duration}</p>
        </div>
      </div>
      <p className="text-gray-600 pl-11">{phase.description}</p>
    </motion.div>
  )
}

const WhatWeDoCivil = () => {
  const services = [
    {
      icon: <MdDesignServices className="w-6 h-6" />,
      title: "Design & Planning",
      description: "Comprehensive architectural design and engineering planning services tailored to project requirements.",
      features: ["3D modeling", "Site analysis", "Regulatory compliance", "Cost estimation"]
    },
    {
      icon: <GiBulldozer className="w-6 h-6" />,
      title: "Site Preparation",
      description: "Full-site preparation including excavation, grading, and utility installation.",
      features: ["Demolition services", "Earthmoving", "Drainage systems", "Land clearing"]
    },
    {
      icon: <FaBuilding className="w-6 h-6" />,
      title: "Construction",
      description: "Turnkey construction solutions from foundation to finishing.",
      features: ["Structural work", "Quality control", "Project management", "Safety compliance"]
    },
    {
      icon: <FaSolarPanel className="w-6 h-6" />,
      title: "Energy Solutions",
      description: "Sustainable energy integration with solar installations and smart systems.",
      features: ["Solar panel installation", "Energy audits", "Maintenance contracts", "Efficiency optimization"]
    },
    {
      icon: <FaTree className="w-6 h-6" />,
      title: "Landscaping",
      description: "Complete landscaping services enhancing both functionality and aesthetics.",
      features: ["Hardscaping", "Irrigation systems", "Garden design", "Boulder laying"]
    },
    {
      icon: <GiElectric className="w-6 h-6" />,
      title: "Electrical Works",
      description: "Full-spectrum electrical solutions for residential and commercial projects.",
      features: ["Wiring installation", "Lighting design", "Safety systems", "Smart home integration"]
    }
  ]

  const phases = [
    {
      icon: <MdDesignServices className="w-5 h-5" />,
      title: "Concept Development",
      duration: "1-2 Weeks",
      description: "Initial consultation and project conceptualization with client requirements analysis"
    },
    {
      icon: <MdFoundation className="w-5 h-5" />,
      title: "Site Preparation",
      duration: "2-4 Weeks",
      description: "Comprehensive site evaluation and preparation including necessary permits"
    },
    {
      icon: <GiBrickWall className="w-5 h-5" />,
      title: "Construction Phase",
      duration: "Project Specific",
      description: "Quality-controlled execution with daily progress monitoring"
    },
    {
      icon: <FaPaintRoller className="w-5 h-5" />,
      title: "Finishing Touches",
      duration: "1-3 Weeks",
      description: "Final installations, landscaping, and client walkthrough"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <BlueprintBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Comprehensive <span className="text-blue-600">Civil Contract</span> Solutions
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            From initial design to final execution, we deliver complete civil contracting services with precision and professionalism.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Project Timeline */}
        <div className="grid lg:grid-cols-2 gap-16 mb-28">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Project Lifecycle</h3>
            <div className="relative">
              {phases.map((phase, index) => (
                <ProjectPhase key={index} phase={phase} index={index} />
              ))}
            </div>
          </div>

          {/* Stats Panel */}
          <motion.div 
            className="bg-blue-600 text-white p-8 rounded-xl h-fit shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">250+</div>
                <p className="text-blue-100">Projects Completed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15k</div>
                <p className="text-blue-100">Sq.Ft Developed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <p className="text-blue-100">Client Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhatWeDoCivil