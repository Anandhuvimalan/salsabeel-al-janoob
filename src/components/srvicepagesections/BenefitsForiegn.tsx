"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FaGlobeAmericas, FaUserGraduate, FaLaptop, FaHandshake } from "react-icons/fa"

const BenefitCard = ({ icon, title, description }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
    >
      <div className="text-blue-500 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: <FaGlobeAmericas />,
      title: "Global Perspective",
      description: "Gain insights into diverse cultures and expand your worldview through language learning.",
    },
    {
      icon: <FaUserGraduate />,
      title: "Expert Instructors",
      description: "Learn from native speakers and experienced language educators passionate about teaching.",
    },
    {
      icon: <FaLaptop />,
      title: "Cutting-edge Technology",
      description: "Access state-of-the-art language labs and interactive online learning platforms.",
    },
    {
      icon: <FaHandshake />,
      title: "Personalized Approach",
      description: "Enjoy customized learning plans tailored to your goals, pace, and learning style.",
    },
  ]

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-blue-600">Our Language Centers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advantages that set our language learning experience apart and propel you towards fluency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection

