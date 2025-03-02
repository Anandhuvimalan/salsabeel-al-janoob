"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  HiOutlineTrash,
  HiOutlineTruck,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiChevronDown
} from "react-icons/hi"
import { 
  RiHospitalLine,
  RiRecycleLine,
  RiBuilding2Line,
  RiComputerLine,
  RiCommunityLine
} from "react-icons/ri"
import { GiFactory } from "react-icons/gi"

const WasteSolutionCard = ({ solution }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-full text-green-600">
          {solution.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{solution.name}</h3>
      </div>
      <p className="text-gray-600 mb-4">{solution.description}</p>
      <ul className="space-y-2">
        {solution.examples.map((ex, i) => (
          <li key={i} className="flex items-center space-x-2 text-gray-500 text-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>{ex}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

const ProcessTimelineItem = ({ step, expanded, onToggle }) => {
  return (
    <div className="relative pl-12 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="absolute left-0 top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
      >
        {step.icon}
      </motion.div>
      <div className="border-l-2 border-blue-200 absolute left-3 top-8 h-full"></div>
      <div className="bg-blue-50 p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-bold text-blue-700">{step.title}</h4>
          <button 
            onClick={onToggle} 
            className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <HiChevronDown className="w-5 h-5" />
            </motion.div>
            {expanded ? "Less" : "More"}
          </button>
        </div>
        <p className="text-blue-600 mt-2">{step.shortDesc}</p>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                height: { duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.3, ease: "easeInOut" }
              }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-3">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center space-x-3 text-blue-600 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const AllWasteManagementSection = () => {
  const wasteSolutions = [
    {
      icon: <RiRecycleLine className="w-6 h-6" />,
      name: "Chemical Waste",
      description: "Advanced methods to neutralize and recycle hazardous chemicals safely.",
      examples: ["Neutralization", "Recycling solvents", "Waste-to-energy"],
    },
    {
      icon: <RiHospitalLine className="w-6 h-6" />,
      name: "Medical Waste",
      description: "Secure collection and disposal of biomedical and pharmaceutical waste.",
      examples: ["Sharps disposal", "Contaminated materials", "Expired drugs"],
    },
    {
      icon: <GiFactory className="w-6 h-6" />,
      name: "Industrial Waste",
      description: "Efficient management of byproducts from manufacturing operations.",
      examples: ["Manufacturing residues", "Heavy metals", "Spent catalysts"],
    },
    {
      icon: <RiBuilding2Line className="w-6 h-6" />,
      name: "Construction & Demolition",
      description: "Recycling and safe disposal of materials from construction sites.",
      examples: ["Concrete", "Metals", "Plastics"],
    },
    {
      icon: <RiComputerLine className="w-6 h-6" />,
      name: "Electronic Waste",
      description: "Eco-friendly solutions for reclaiming valuable materials from e-waste.",
      examples: ["Circuit boards", "Batteries", "Plastics"],
    },
    {
      icon: <RiCommunityLine className="w-6 h-6" />,
      name: "Municipal Waste",
      description: "Comprehensive waste collection and recycling services for communities.",
      examples: ["Household trash", "Organic waste", "Recyclables"],
    },
  ]

  const processSteps = [
    {
      icon: <HiOutlineTruck className="w-5 h-5" />,
      title: "Collection & Segregation",
      shortDesc: "Efficient gathering and sorting of diverse waste streams.",
      details: [
        "Scheduled pick-ups & smart bins",
        "On-site sorting to maximize recycling",
        "Safety protocols for hazardous materials",
      ],
    },
    {
      icon: <HiOutlineTrash className="w-5 h-5" />,
      title: "Transportation",
      shortDesc: "Eco-friendly logistics to move waste securely.",
      details: [
        "Optimized routes for fuel efficiency",
        "Dedicated vehicles for different waste types",
        "Real-time tracking for transparency",
      ],
    },
    {
      icon: <HiOutlineRefresh className="w-5 h-5" />,
      title: "Processing & Recycling",
      shortDesc: "State-of-the-art facilities to reclaim valuable resources.",
      details: [
        "Advanced sorting technologies",
        "Chemical and mechanical recycling methods",
        "Strict quality control measures",
      ],
    },
    {
      icon: <HiOutlineCheck className="w-5 h-5" />,
      title: "Disposal & Recovery",
      shortDesc: "Safe disposal and recovery practices ensuring sustainability.",
      details: [
        "Environmentally compliant disposal methods",
        "Resource recovery initiatives",
        "Continuous monitoring and improvement",
      ],
    },
  ]

  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-800"
          >
            All Waste Management <span className="text-green-600">Solutions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            From collection to recovery, we handle every waste stream with a commitment to sustainability and innovation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {wasteSolutions.map((solution, index) => (
            <WasteSolutionCard key={index} solution={solution} />
          ))}
        </div>

        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 mb-8"
          >
            Our Process
          </motion.h3>
          <div className="relative">
            {processSteps.map((step, index) => (
              <ProcessTimelineItem
                key={index}
                step={step}
                expanded={expandedStep === index}
                onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 bg-green-600 rounded-lg shadow-lg text-white text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="text-4xl font-bold mb-2"
          >
            100% Satisfaction
          </motion.div>
          <p className="text-lg">
            We're dedicated to efficient, safe, and sustainable waste management practices.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default AllWasteManagementSection