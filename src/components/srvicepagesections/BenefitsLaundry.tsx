"use client"
import { cn } from "@/lib/utils"
import { motion, useAnimation, useInView } from "framer-motion"
import { FaTshirt, FaClock, FaLeaf, FaTruck, FaStar } from "react-icons/fa"
import { GiWaterDrop } from "react-icons/gi"
import { MdOutlineLocalLaundryService, MdIron } from "react-icons/md"
import { useEffect, useRef } from "react"

export default function LaundryBenefits() {
  const mainRef = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(mainRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section 
      className="py-20 bg-gradient-to-b from-blue-50/10 to-white relative overflow-hidden"
      ref={mainRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Premium Care,
          </span>
          <br />
          <span className="text-gray-800">Exceptional Results</span>
        </motion.h2>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 xl:gap-20">
          {/* Feature Cards Column */}
          <div className="space-y-8">
            <FeatureCard
              icon={<MdOutlineLocalLaundryService className="w-8 h-8" />}
              title="Advanced Cleaning"
              description="Temperature-controlled cycles with eco-friendly detergents"
              color="bg-blue-100"
              delay={0.2}
            />
            <FeatureCard
              icon={<MdIron className="w-8 h-8" />}
              title="Professional Pressing"
              description="Crisp finishes with steam iron technology"
              color="bg-amber-100"
              delay={0.4}
            />
          </div>

          {/* Stats Visualization */}
          <motion.div 
            className="relative h-[500px] bg-white rounded-3xl shadow-xl p-6 md:p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.6 } }
            }}
          >
            {/* Stats Grid */}
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <motion.div
                className="w-full max-w-xs"
                initial={{ scale: 0.8 }}
                animate={controls}
                variants={{
                  visible: { scale: 1, transition: { type: "spring", delay: 0.8 } }
                }}
              >
                <StatCard
                  value="98%"
                  label="Customer Satisfaction"
                  icon={<FaStar className="w-6 h-6" />}
                  color="bg-green-100"
                />
              </motion.div>
              
              <motion.div
                className="w-full max-w-xs"
                initial={{ scale: 0.8 }}
                animate={controls}
                variants={{
                  visible: { scale: 1, transition: { type: "spring", delay: 1.0 } }
                }}
              >
                <StatCard
                  value="30min"
                  label="Express Service"
                  icon={<FaClock className="w-6 h-6" />}
                  color="bg-amber-100"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Features */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <MotionFeature
            icon={<FaLeaf className="w-6 h-6" />}
            title="Eco Friendly"
            description="Biodegradable detergents and energy-efficient processes"
            delay={0.4}
          />
          <MotionFeature
            icon={<FaTruck className="w-6 h-6" />}
            title="Free Pickup"
            description="Convenient door-to-door service"
            delay={0.6}
          />
          <MotionFeature
            icon={<FaStar className="w-6 h-6" />}
            title="Quality Guarantee"
            description="Perfect results or we'll rewash for free"
            delay={0.8}
          />
        </motion.div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon, title, description, color, delay }) => {
  const ref = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      className={`p-6 md:p-8 rounded-2xl ${color} relative overflow-hidden`}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}
    >
      <div className="relative z-10">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 md:text-lg">{description}</p>
      </div>
    </motion.div>
  )
}

const StatCard = ({ value, label, icon, color }) => (
  <div className={`p-6 rounded-xl ${color} text-center transition-transform duration-300 hover:scale-105`}>
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="p-2 bg-white rounded-lg">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
)

const MotionFeature = ({ icon, title, description, delay }) => (
  <motion.div
    className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
    variants={{
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
    }}
    initial={{ opacity: 0, y: 30 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)