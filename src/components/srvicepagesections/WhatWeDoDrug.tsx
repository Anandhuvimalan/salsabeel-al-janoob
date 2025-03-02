"use client"
import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { FaHandsHelping, FaHeartbeat, FaBrain, FaComments, FaLeaf } from "react-icons/fa"

const TherapyCard = ({ therapy, index }) => {
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
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: index * 0.2,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
        <div className="flex items-start gap-5 mb-6">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            {therapy.icon}
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">{therapy.title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{therapy.description}</p>
        
        <div className="space-y-3 border-t pt-6 border-gray-100">
          {therapy.methods.map((method, i) => (
            <div key={i} className="flex items-center text-gray-600">
              <FaLeaf className="w-4 h-4 text-indigo-500 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{method}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const RecoveryProcess = () => {
  const steps = [
    {
      title: "Initial Assessment",
      description: "Confidential evaluation of needs and goals",
      icon: <FaComments className="w-6 h-6" />
    },
    {
      title: "Personalized Plan",
      description: "Customized treatment strategy development",
      icon: <FaBrain className="w-6 h-6" />
    },
    {
      title: "Active Recovery",
      description: "Ongoing therapy and skill building",
      icon: <FaHeartbeat className="w-6 h-6" />
    },
    {
      title: "Aftercare Support",
      description: "Long-term maintenance strategies",
      icon: <FaHandsHelping className="w-6 h-6" />
    }
  ]

  return (
    <div className="py-12">
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="p-6 bg-white rounded-xl border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                {step.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{step.title}</h4>
            </div>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const WhatWeDoSection = () => {
  const therapies = [
    {
      icon: <FaHandsHelping className="w-6 h-6" />,
      title: "Individual Counseling",
      description: "One-on-one sessions focused on personal recovery journeys and relapse prevention strategies",
      methods: [
        "Cognitive Behavioral Therapy",
        "Motivational Enhancement",
        "Trauma-Informed Care"
      ]
    },
    {
      icon: <FaHeartbeat className="w-6 h-6" />,
      title: "Wellness Programs",
      description: "Holistic approaches to support physical and mental health during recovery",
      methods: [
        "Stress Management Techniques",
        "Mindfulness Practices",
        "Nutritional Guidance"
      ]
    },
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: "Family Support",
      description: "Rebuilding relationships and creating healthy support systems",
      methods: [
        "Family Therapy Sessions",
        "Communication Strategies",
        "Boundary Setting"
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Compassionate <span className="text-indigo-600">Addiction Recovery</span>
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Personalized pathways to sustainable sobriety and emotional wellness
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {therapies.map((therapy, index) => (
            <TherapyCard
              key={index}
              therapy={therapy}
              index={index}
            />
          ))}
        </div>

        <motion.h3 
          className="text-2xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Our Recovery Process
        </motion.h3>
        <RecoveryProcess />

        <motion.div 
          className="mt-20 grid md:grid-cols-3 gap-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="p-8 bg-indigo-50 rounded-xl">
            <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
            <p className="text-sm text-gray-600">Recovery Success Rate</p>
          </div>
          <div className="p-8 bg-indigo-50 rounded-xl">
            <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
            <p className="text-sm text-gray-600">Support Availability</p>
          </div>
          <div className="p-8 bg-indigo-50 rounded-xl">
            <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
            <p className="text-sm text-gray-600">Lives Transformed</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatWeDoSection