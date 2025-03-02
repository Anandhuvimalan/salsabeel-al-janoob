"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { FaTshirt, FaClock, FaLeaf, FaTruck, FaStar, FaWater, FaFire } from "react-icons/fa"
import { GiWashingMachine } from "react-icons/gi"
import { MdLocalLaundryService, MdDryCleaning, MdIron } from "react-icons/md"
const FabricWaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <svg viewBox="0 0 500 200" className="w-full h-full">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M0 ${25 + i * 20} Q 250 ${40 + i * 20} 500 ${25 + i * 20}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            initial={{ pathOffset: 0 }}
            animate={{ pathOffset: -1000 }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  )
}

const ServiceCard = ({ service, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}
      initial="hidden"
      animate={controls}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative h-full"
    >
      <motion.div
  className="h-full bg-white p-8 rounded-2xl shadow-lg border border-blue-50 flex flex-col"
  animate={{ 
    rotate: hovered ? 2 : 0,
    scale: hovered ? 1.02 : 1
  }}
  transition={{ 
    type: "spring", 
    stiffness: 300,
    damping: 10,
    mass: 0.5
  }}
>
        <div className="mb-6 flex justify-center">
          <motion.div
            className="p-5 rounded-xl bg-blue-50 text-blue-600"
            animate={{ rotate: hovered ? 10 : 0 }}
          >
            {service.icon}
          </motion.div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {service.title}
        </h3>
        
        <motion.div
          className="w-16 h-1 bg-blue-400 mx-auto mb-6 rounded-full"
          animate={{ width: hovered ? 100 : 64 }}
          transition={{ duration: 0.3 }}
        />

        <ul className="space-y-3 flex-1">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center text-gray-600">
              <FaStar className="text-blue-400 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {service.special && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: hovered ? 1.1 : 1 }}
            className="mt-6 inline-block mx-auto px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
          >
            {service.special}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

const ProcessStep = ({ step, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.2 } }
      }}
      initial="hidden"
      animate={controls}
    >
      <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center mb-6 text-3xl">
        {step.icon}
      </div>
      
      <h4 className="text-xl font-semibold text-gray-800 mb-3">
        {step.title}
      </h4>
      <p className="text-gray-600 mb-4">{step.description}</p>
      
      <div className="flex space-x-2">
        {step.tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {index < 3 && (
        <motion.div
          className="hidden md:block absolute top-24 left-3/4 w-32 h-1 bg-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
        />
      )}
    </motion.div>
  )
}

const SectionHeading = ({ title, subtitle }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
        initial="hidden"
        animate={controls}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {title} <span className="text-blue-500">{subtitle}</span>
        </h2>
        <div className="flex justify-center">
          <motion.div
            className="h-2 w-24 bg-blue-400 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  )
}

const WhatWeDoSection = () => {
    const services = [
        {
          icon: <GiWashingMachine className="w-8 h-8" />,
          title: "Premium Washing",
          features: [
            "Temperature-controlled cycles",
            "Hypoallergenic options",
            "Eco-friendly detergents",
            "Stain removal expertise"
          ],
          special: "2-hour Express Service"
        },
        {
          icon: <MdDryCleaning className="w-8 h-8" />,
          title: "Dry Cleaning",
          features: [
            "Delicate fabric care",
            "Spot treatment system",
            "Professional pressing",
            "Odor removal technology"
          ],
          special: "Wedding Dress Specialists"
        },
        {
          icon: <MdIron className="w-8 h-8" />,
          title: "Ironing Service",
          features: [
            "Steam iron technology",
            "Wrinkle-free guarantee",
            "Bulk handling available",
            "Same-day service"
          ],
          special: "Commercial Bulk Service"
        },
        {
          icon: <FaTshirt className="w-8 h-8" />,
          title: "Specialty Care",
          features: [
            "Leather & suede cleaning",
            "Curtain & upholstery",
            "Baby clothes sanitization",
            "Eco dye protection"
          ],
          special: "Antique Textile Experts"
        }
      ]

  const processSteps = [
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Schedule Pickup",
      description: "Book through our app or website for free collection",
      tags: ["24/7 Booking", "GPS Tracking"]
    },
    {
      icon: <FaWater className="w-8 h-8" />,
      title: "Expert Cleaning",
      description: "State-of-the-art facilities with quality control",
      tags: ["Eco Detergents", "ISO Certified"]
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "Quality Check",
      description: "Detailed quality inspection before delivery",
      tags: ["Spot Check", "Press Finish"]
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Eco Delivery",
      description: "Carbon-neutral delivery in protective packaging",
      tags: ["Bike Couriers", "Reusable Covers"]
    }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <FabricWaveBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading 
          title="Laundry Services"
          subtitle="Excellence"
        />

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-28">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Process Steps */}
        <SectionHeading
          title="Our Seamless"
          subtitle="Process"
        />
        <div className="grid md:grid-cols-4 gap-12 relative">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={index}
              step={step}
              index={index}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Service Availability</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">15k+</div>
            <div className="text-gray-600">Items Processed Daily</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Eco-Friendly</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatWeDoSection