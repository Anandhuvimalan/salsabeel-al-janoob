"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { FaFlask, FaLeaf, FaTruck, FaCheckCircle, FaSearchPlus } from "react-icons/fa"
import { BiAnalyse } from "react-icons/bi"
import { GiChemicalDrop, GiChemicalTank, GiRadioactive, GiFactory } from "react-icons/gi"
import { MdScience, MdRecycling } from "react-icons/md"

/* 1) Background hex grid */
const HexagonGrid = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="relative w-full h-full">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 border-2 border-amber-500"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: `${Math.random() * 30}deg`,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + Math.random() * 5,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* 2) Single WasteCard */
const WasteCard = ({ category, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      initial="hidden"
      animate={controls}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group perspective"
    >
      <motion.div
        className="relative bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg shadow-md overflow-hidden border-t border-white/60 flex flex-col h-[320px]"
        animate={{
          rotateX: hovered ? -5 : 0,
          rotateY: hovered ? 5 : 0,
          z: hovered ? 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -translate-y-16 -translate-x-16 opacity-20 group-hover:opacity-40 transition-opacity" />

        <div className="flex items-center space-x-4 mb-4 relative z-10">
          <div className="p-3 bg-amber-100 rounded-lg text-amber-700 transition-transform group-hover:-rotate-12 duration-300">
            {category.icon}
          </div>
          <h3 className="text-xl font-bold text-zinc-800">{category.name}</h3>
        </div>

        <motion.div
          className="w-full h-1 bg-gradient-to-r from-amber-300 to-amber-100 rounded-full mb-4"
          initial={{ width: 0 }}
          animate={{ width: hovered ? "100%" : "40%" }}
          transition={{ duration: 0.5 }}
        />

        <p className="text-zinc-600 mb-4 leading-relaxed">{category.description}</p>

        <ul className="space-y-2 mt-4">
          {category.examples.map((example, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center text-sm text-zinc-700"
            >
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>
              {example}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

/* 3) ProcessStep with entire card clickable */
const ProcessStep = ({ step, index, isExpanded, onToggle }) => {
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
      className="relative"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, delay: index * 0.2 } },
      }}
      initial="hidden"
      animate={controls}
    >
      {index < 3 && (
        <motion.div
          className="hidden lg:block absolute top-1/2 -right-8 w-16 h-1"
          initial={{ scaleX: 0, originX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 10">
            <motion.path
              d="M0,5 C30,5 70,-5 100,5"
              fill="none"
              stroke="#FCD34D"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
            />
          </svg>
        </motion.div>
      )}

      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
        whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className={`p-6 flex flex-col ${!isExpanded ? "h-[320px]" : ""}`}>
          {/* Top content */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                className={`w-16 h-16 flex items-center justify-center rounded-lg flex-shrink-0 ${step.colorClass}`}
              >
                {step.icon}
              </motion.div>

              <div className="flex flex-wrap gap-2">
                {step.forWho.map((type, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      type === "Industrial"
                        ? "bg-indigo-100 text-indigo-800"
                        : type === "Commercial"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-800 mb-1 flex items-center">
                <span className="text-amber-400 mr-2">{(index + 1).toString().padStart(2, "0")}</span>
                {step.title}
              </h3>

              <p className="text-zinc-600">{step.shortDesc}</p>
            </div>
          </div>

          {/* View Details button at bottom */}
          <div className="mt-auto pt-4 flex justify-end">
            <button className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700 transition-colors">
              <FaSearchPlus />
              {isExpanded ? "Hide details" : "View details"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key={`details-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6 bg-white"
            >
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="font-medium text-amber-800 mb-2">How we do it:</h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-sm text-zinc-700">
                        <FaCheckCircle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

/* 4) Section heading */
const SectionHeading = ({ children, accentText }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <div ref={ref} className="mb-16 text-center relative">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 inline-block">
          {children} <span className="text-amber-500">{accentText}</span>
        </h2>
        <motion.div
          className="h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 mt-4 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: "80px" } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>
    </div>
  )
}

/* 5) Main section */
const WhatWeDoSection = () => {
  const wasteCategories = [
    {
      icon: <GiChemicalDrop className="w-6 h-6" />,
      name: "Industrial Chemicals",
      description: "Specialized handling for high-volume industrial chemical waste with environmental safeguards.",
      examples: ["Petrochemical byproducts", "Manufacturing solvents", "Process catalysts"],
    },
    {
      icon: <GiRadioactive className="w-6 h-6" />,
      name: "Hazardous Materials",
      description: "Expert containment and disposal of materials requiring specialized treatment protocols.",
      examples: ["Heavy metals", "Reactive compounds", "Corrosive substances"],
    },
    {
      icon: <GiChemicalTank className="w-6 h-6" />,
      name: "Laboratory Waste",
      description: "Precision handling of sensitive research and quality control chemical waste streams.",
      examples: ["Analytical reagents", "Biological stains", "Diagnostic chemicals"],
    },
    {
      icon: <MdScience className="w-6 h-6" />,
      name: "Pharmaceutical Waste",
      description: "Compliant disposal pathways for expired, unused, or contaminated pharmaceutical compounds.",
      examples: ["Expired medications", "Research compounds", "Production residues"],
    },
    {
      icon: <GiFactory className="w-6 h-6" />,
      name: "Manufacturing Byproducts",
      description: "Efficient processing of chemical waste generated during manufacturing processes.",
      examples: ["Coating residues", "Plating solutions", "Process chemicals"],
    },
    {
      icon: <MdRecycling className="w-6 h-6" />,
      name: "Recoverable Resources",
      description: "Innovative recovery processes that extract value from chemical waste streams.",
      examples: ["Precious metal solutions", "Reusable solvents", "Reclaimed acids"],
    },
  ]

  const processSteps = [
    {
      icon: <BiAnalyse className="w-8 h-8 text-indigo-600" />,
      title: "Intelligent Assessment",
      shortDesc: "Comprehensive chemical profiling and risk evaluation",
      colorClass: "bg-indigo-50 text-indigo-600",
      forWho: ["Industrial", "Commercial", "Residential"],
      details: [
        "Advanced spectroscopy analysis of unknown compounds",
        "Comprehensive risk assessment with regulatory compliance mapping",
        "Customized handling protocol development based on chemical properties",
        "Digital documentation with secure client portal access",
      ],
    },
    {
      icon: <FaFlask className="w-8 h-8 text-emerald-600" />,
      title: "Specialized Containment",
      shortDesc: "Custom containment solutions for every chemical class",
      colorClass: "bg-emerald-50 text-emerald-600",
      forWho: ["Industrial", "Commercial"],
      details: [
        "UN-certified containment vessels with chemical compatibility guarantees",
        "Remote monitoring systems for volatile or reactive compounds",
        "Temperature-controlled storage for thermally sensitive materials",
        "Segregation protocols to prevent cross-contamination",
      ],
    },
    {
      icon: <FaTruck className="w-8 h-8 text-purple-600" />,
      title: "Secure Transport",
      shortDesc: "GPS-tracked, environmentally controlled logistics",
      colorClass: "bg-purple-50 text-purple-600",
      forWho: ["Industrial", "Commercial"],
      details: [
        "Real-time GPS tracking with client monitoring capabilities",
        "Climate-controlled transport units with secondary containment",
        "Specialized vehicles with spill response equipment onboard",
        "ADR-certified drivers with hazardous materials handling training",
      ],
    },
    {
      icon: <FaLeaf className="w-8 h-8 text-amber-600" />,
      title: "Sustainable Processing",
      shortDesc: "Cutting-edge technologies for minimal environmental impact",
      colorClass: "bg-amber-50 text-amber-600",
      forWho: ["Industrial"],
      details: [
        "Chemical neutralization processes with zero harmful byproducts",
        "Resource recovery systems for precious metals and reusable compounds",
        "Low-temperature plasma treatment for organic chemical breakdown",
        "Digital certification of destruction with blockchain verification",
      ],
    },
  ]

  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50/50 to-white relative overflow-hidden">
      <HexagonGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Waste Categories */}
        <SectionHeading accentText="Expertise">Our Chemical Waste</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28 items-start">
          {wasteCategories.map((category, index) => (
            <WasteCard key={index} category={category} delay={index * 0.1} />
          ))}
        </div>

        {/* Process Steps */}
        <SectionHeading accentText="Process">Our Advanced</SectionHeading>
        {/*
          IMPORTANT: We add `items-start` so each column can grow independently
        */}
        <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-stretch">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={`${step.title}-${index}`}
              step={step}
              index={index}
              isExpanded={expandedStep === index}
              onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
            />
          ))}
        </div>

        {/* Statistics Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 p-6 md:p-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-xl text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-6 md:pb-0">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                99.8%
              </motion.div>
              <p className="text-amber-100">Recovery Rate</p>
            </div>
            <div className="text-center border-b md:border-b-0 md:border-r border-white/20 pb-6 md:pb-0">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                15,000+
              </motion.div>
              <p className="text-amber-100">Tons Processed Annually</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                0
              </motion.div>
              <p className="text-amber-100">Environmental Incidents</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatWeDoSection
