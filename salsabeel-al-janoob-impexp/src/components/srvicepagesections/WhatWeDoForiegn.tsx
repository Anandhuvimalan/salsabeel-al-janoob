"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { FaGlobe, FaComments, FaUserGraduate, FaLaptop, FaPlane, FaBriefcase } from "react-icons/fa"

const LanguageCard = ({ language, icon, description, delay = 0 }) => {
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
      className="group"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden border-t border-blue-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 transition-transform group-hover:scale-110 duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{language}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>
      </div>
    </motion.div>
  )
}

const LearningMethod = ({ title, description, icon, index }) => {
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
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      initial="hidden"
      animate={controls}
      className="flex items-start space-x-4"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

const WhatWeDoSection = () => {
  const [activeTab, setActiveTab] = useState("languages")

  const languages = [
    {
      name: "Spanish",
      icon: <FaGlobe className="w-6 h-6" />,
      description:
        "Immerse yourself in the vibrant world of Spanish, from basic conversations to advanced literature and cultural studies.",
    },
    {
      name: "Mandarin",
      icon: <FaComments className="w-6 h-6" />,
      description:
        "Master the tones and characters of Mandarin Chinese, opening doors to one of the world's most spoken languages.",
    },
    {
      name: "French",
      icon: <FaUserGraduate className="w-6 h-6" />,
      description:
        "From the streets of Paris to the vineyards of Bordeaux, our French courses bring the language of love to life.",
    },
    {
      name: "German",
      icon: <FaLaptop className="w-6 h-6" />,
      description:
        "Dive into the language of philosophers and innovators with our comprehensive German language programs.",
    },
  ]

  const learningMethods = [
    {
      title: "Immersive Learning",
      description:
        "Our state-of-the-art language labs and virtual reality experiences transport you to native-speaking environments.",
      icon: <FaGlobe className="w-6 h-6" />,
    },
    {
      title: "Conversational Practice",
      description:
        "Regular conversation clubs and language exchange programs with native speakers enhance your speaking skills.",
      icon: <FaComments className="w-6 h-6" />,
    },
    {
      title: "Cultural Integration",
      description:
        "Learn beyond the language with cultural workshops, cooking classes, and international film screenings.",
      icon: <FaPlane className="w-6 h-6" />,
    },
    {
      title: "Professional Focus",
      description:
        "Specialized courses for business, medical, legal, and technical language to advance your career globally.",
      icon: <FaBriefcase className="w-6 h-6" />,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Our <span className="text-blue-600">Language Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Embark on a journey of linguistic mastery with our comprehensive and immersive language learning
            experiences.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("languages")}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${
                activeTab === "languages" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Languages
            </button>
            <button
              onClick={() => setActiveTab("methods")}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-colors ${
                activeTab === "methods" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Learning Methods
            </button>
          </div>

          {activeTab === "languages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {languages.map((lang, index) => (
                <LanguageCard key={lang.name} {...lang} delay={index * 0.1} />
              ))}
            </div>
          )}

          {activeTab === "methods" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {learningMethods.map((method, index) => (
                <LearningMethod key={method.title} {...method} index={index} />
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-blue-600 text-white rounded-xl shadow-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Language Journey?</h3>
          <p className="text-lg mb-6">Join thousands of successful learners and open doors to new opportunities.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors">
            Enroll Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatWeDoSection

