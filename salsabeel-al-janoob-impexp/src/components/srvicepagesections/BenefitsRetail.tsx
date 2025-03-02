"use client"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Users, 
  Target, 
  ShoppingBag,
  BarChart,
  Zap
} from "lucide-react"

const RetailBenefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-purple-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
        >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Choose Our <span className="text-purple-600">Retail Expertise</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your retail business with data-driven strategies and proven market solutions
        </p>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              {/* Animated background layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
              
              {/* Card content */}
              <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                    <div className="h-1 w-10 bg-purple-500 mt-2 group-hover:w-20 transition-all duration-300" />
                  </div>
                </div>

                <p className="text-gray-600 flex-1">{benefit.description}</p>

                {benefit.stats && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {benefit.stats.map((stat, idx) => (
                      <div 
                        key={idx}
                        className="text-center p-3 bg-purple-50 rounded-lg flex flex-col justify-center min-h-[80px]"
                      >
                        <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const benefits = [
  {
    title: "Data-Driven Strategy",
    description: "Harness advanced analytics and AI-powered insights to optimize decision-making and drive sustainable growth.",
    icon: <BarChart className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "98%", label: "Accuracy Rate" },
      { value: "2.5x", label: "ROI Average" }
    ]
  },
  {
    title: "Customer Experience",
    description: "Implement personalized engagement strategies powered by consumer behavior analytics.",
    icon: <Users className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "+45%", label: "Satisfaction" },
      { value: "-20%", label: "Churn Rate" }
    ]
  },
  {
    title: "Market Dominance",
    description: "Strategic positioning and competitive analysis for maximum brand visibility.",
    icon: <Target className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "85%", label: "Coverage" },
      { value: "+60%", label: "Digital Growth" }
    ]
  },
  {
    title: "Supply Chain Mastery",
    description: "End-to-end optimization with real-time inventory tracking and predictive logistics.",
    icon: <ShoppingBag className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "-30%", label: "Costs" },
      { value: "99.9%", label: "Accuracy" }
    ]
  },
  {
    title: "Growth Engine",
    description: "Scalable solutions for market expansion and revenue acceleration.",
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "+40%", label: "Revenue" },
      { value: "3x", label: "Market Share" }
    ]
  },
  {
    title: "Tech Innovation",
    description: "Future-proof your business with cutting-edge retail technology integration.",
    icon: <Zap className="w-6 h-6 text-purple-600" />,
    stats: [
      { value: "12+", label: "Solutions" },
      { value: "24/7", label: "Support" }
    ]
  }
]

export default RetailBenefits