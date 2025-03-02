"use client"
import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { FaGraduationCap, FaNetworkWired, FaUserTie, FaChartLine, FaRegLightbulb } from "react-icons/fa"
import { GiBookshelf } from "react-icons/gi"
import { MdSchool, MdWorkspacePremium } from "react-icons/md"

const PathwayCard = ({ stage, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay } }
      }}
      initial="hidden"
      animate={controls}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-100 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            {stage.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {stage.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {stage.description}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ul className="space-y-3">
            {stage.features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-600">
                <FaRegLightbulb className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

const SuccessStep = ({ step, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 border-l-2 border-blue-100"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white -left-[13px] top-0">
        {index + 1}
      </div>
      <div className="pb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {step.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
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
    <div ref={ref} className="mb-12">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          <span className="text-blue-600">{title}</span> {subtitle}
        </h2>
        <div className="w-12 h-1 bg-blue-500 rounded-full" />
      </motion.div>
    </div>
  )
}

const WhatWeDoSection = () => {
  const services = [
    {
      icon: <FaUserTie className="w-6 h-6" />,
      title: "Personalized Assessment",
      description: "Comprehensive evaluation to identify strengths and career potential",
      features: [
        "Psychometric testing",
        "Interest & skill mapping",
        "Career compatibility report"
      ]
    },
    {
      icon: <MdSchool className="w-6 h-6" />,
      title: "Academic Roadmapping",
      description: "Strategic educational planning for optimal outcomes",
      features: [
        "University selection strategy",
        "Course optimization",
        "Scholarship guidance"
      ]
    },
    {
      icon: <FaNetworkWired className="w-6 h-6" />,
      title: "Career Development",
      description: "Bridging academia with professional success",
      features: [
        "Professional portfolio building",
        "Interview mastery programs",
        "Industry networking strategies"
      ]
    }
  ]

  const journey = [
    {
      title: "Discovery Phase",
      description: "Initial assessment and goal setting through personalized sessions"
    },
    {
      title: "Skill Building",
      description: "Customized learning plans and workshop participation"
    },
    {
      title: "Industry Exposure",
      description: "Internships and professional networking opportunities"
    },
    {
      title: "Career Launch",
      description: "Job placement support and long-term career strategy"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Educational" subtitle="Guidance" />

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => (
            <PathwayCard
              key={index}
              stage={service}
              delay={index * 0.1}
            />
          ))}
        </div>

        <SectionHeading title="Success" subtitle="Journey" />
        
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {journey.map((step, index) => (
            <SuccessStep
              key={index}
              step={step}
              index={index}
            />
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-sm font-medium text-gray-600">University Acceptance Rate</div>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm font-medium text-gray-600">Industry Partnerships</div>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-sm font-medium text-gray-600">Successful Transitions</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatWeDoSection