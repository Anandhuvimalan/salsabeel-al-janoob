"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Store, 
  Boxes,
  Smartphone,
  Target,
  ChevronDown,
  CheckCircle2
} from "lucide-react"

const ServiceCard = ({ service, index }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: index * 0.2 }
        }
      }}
      className="relative"
    >
      <motion.div
        className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 ${
          isExpanded ? 'ring-2 ring-blue-400' : 'hover:shadow-xl'
        }`}
        layout
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-8 h-8 text-blue-600">
              {service.icon}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {service.description}
            </p>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Learn more
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ 
                opacity: 1, 
                maxHeight: 1000,
                transition: { 
                  duration: 0.3, 
                  ease: "easeOut",
                  opacity: { duration: 0.15 }
                }
              }}
              exit={{ 
                opacity: 0, 
                maxHeight: 0,
                transition: { 
                  duration: 0.2, 
                  ease: "easeIn",
                  opacity: { duration: 0.1 }
                }
              }}
              className="mt-6 pt-6 border-t border-gray-100"
              style={{ overflow: 'hidden' }}
            >
              <div className="grid gap-4">
                {service.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

const StatisticCard = ({ stat }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.5 }
        }
      }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${stat.iconBg}`}>
        {stat.icon}
      </div>
      <div className="font-bold text-3xl text-gray-900 mb-2">
        {stat.value}
      </div>
      <div className="text-gray-600">
        {stat.label}
      </div>
    </motion.div>
  )
}

const RetailWhatWeDoSection = () => {
    const services = [
      {
        icon: <TrendingUp className="w-full h-full" />,
        title: "Market Analysis & Strategy",
        description: "Data-driven insights to optimize your retail performance and market positioning.",
        features: [
          "Comprehensive market research and competitor analysis",
          "Consumer behavior and trend forecasting",
          "Price optimization strategies",
          "Market entry and expansion planning"
        ]
      },
      {
        icon: <Store className="w-full h-full" />,
        title: "Store Operations Excellence",
        description: "Streamline your retail operations for maximum efficiency and customer satisfaction.",
        features: [
          "Store layout and visual merchandising optimization",
          "Staff training and performance management",
          "Inventory management systems",
          "Loss prevention strategies"
        ]
      },
      {
        icon: <Smartphone className="w-full h-full" />,
        title: "Digital Integration",
        description: "Seamlessly blend physical and digital retail experiences for modern consumers.",
        features: [
          "Omnichannel strategy development",
          "E-commerce platform optimization",
          "Mobile commerce solutions",
          "Digital payment integration"
        ]
      },
      {
        icon: <Target className="w-full h-full" />,
        title: "Customer Experience Design",
        description: "Create memorable shopping experiences that drive loyalty and sales.",
        features: [
          "Customer journey mapping",
          "Loyalty program development",
          "Experience personalization strategies",
          "Customer feedback systems"
        ]
      }
    ]
  
    const statistics = [
      {
        icon: <ShoppingBag className="w-6 h-6 text-emerald-600" />,
        value: "500+",
        label: "Retail Projects Completed",
        iconBg: "bg-emerald-50"
      },
      {
        icon: <Users className="w-6 h-6 text-blue-600" />,
        value: "1M+",
        label: "Customer Interactions Analyzed",
        iconBg: "bg-blue-50"
      },
      {
        icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
        value: "35%",
        label: "Average Revenue Increase",
        iconBg: "bg-purple-50"
      },
      {
        icon: <Boxes className="w-6 h-6 text-orange-600" />,
        value: "50+",
        label: "Global Markets Served",
        iconBg: "bg-orange-50"
      }
    ]
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Transforming Retail Through 
            <span className="text-blue-600"> Expert Solutions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            We combine industry expertise with innovative strategies to help retailers thrive in today's dynamic market.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <StatisticCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RetailWhatWeDoSection