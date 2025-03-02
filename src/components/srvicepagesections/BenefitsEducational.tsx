"use client"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"
import { FaUserGraduate, FaHandshake, FaChartBar, FaLightbulb, FaStar } from "react-icons/fa"
import { GiProgression } from "react-icons/gi"

const BenefitCard = ({ benefit, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
      }}
      className="h-full"
    >
      <div className="h-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            {benefit.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{benefit.title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{benefit.description}</p>
        <div className="space-y-2">
          {benefit.features.map((feature, i) => (
            <div key={i} className="flex items-center text-gray-600">
              <FaStar className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: <FaUserGraduate className="w-6 h-6" />,
      title: "Personalized Approach",
      description: "Tailored strategies for individual academic and career goals",
      features: [
        "1-on-1 mentorship programs",
        "Custom learning roadmaps",
        "Individual strength analysis"
      ]
    },
    {
      icon: <GiProgression className="w-6 h-6" />,
      title: "Proven Progression",
      description: "Structured pathways to measurable success",
      features: [
        "94% university acceptance rate",
        "83% career transition success",
        "5-year tracking support"
      ]
    },
    {
      icon: <FaChartBar className="w-6 h-6" />,
      title: "Industry Integration",
      description: "Direct connections to professional opportunities",
      features: [
        "500+ corporate partnerships",
        "Exclusive internship programs",
        "Alumni networking events"
      ]
    }
  ]

  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Availability" },
    { value: "10K+", label: "Students Guided" }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-blue-600">Our Expertise</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transforming educational journeys into career success stories through innovative
            guidance and proven methodologies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              index={index}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 bg-blue-50 rounded-xl text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs