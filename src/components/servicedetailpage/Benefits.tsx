"use client"
import { cn } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { motion } from "framer-motion"
import { FaShieldAlt, FaRecycle, FaFlask, FaChartLine, FaHeadset } from "react-icons/fa"
import { GiChemicalTank } from "react-icons/gi"

export default function BentoGridThirdDemo() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Chemical Waste Management <span className="text-blue-600">Solutions</span>
        </h2>
        
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

const SkeletonOne = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  }
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  }
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-green-50 flex-col space-y-2 p-4"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-blue-100 p-2 items-center space-x-2 bg-white"
      >
        <FaShieldAlt className="h-6 w-6 text-blue-600" />
        <div className="w-full bg-blue-100 h-3 rounded-full" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-xl border border-blue-100 p-2 items-center space-x-2 w-3/4 ml-auto bg-white"
      >
        <div className="w-full bg-blue-100 h-3 rounded-full" />
        <GiChemicalTank className="h-6 w-6 text-green-600" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-xl border border-blue-100 p-2 items-center space-x-2 bg-white"
      >
        <FaRecycle className="h-6 w-6 text-green-600" />
        <div className="w-full bg-blue-100 h-3 rounded-full" />
      </motion.div>
    </motion.div>
  )
}

const SkeletonTwo = () => {
  const processSteps = [
    { color: "bg-amber-400", width: "100%" },
    { color: "bg-blue-400", width: "100%" },
    { color: "bg-green-400", width: "100%" },
  ]
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-amber-50 to-blue-50 flex-col space-y-4 p-4">
      {processSteps.map((step, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{['Waste Collection', 'Treatment Process', 'Safe Disposal'][i]}</span>
            <span>{['100%', '100%', '100%'][i]}</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: step.width }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className={`h-3 rounded-full ${step.color} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </motion.div>
        </div>
      ))}
    </motion.div>
  )
}

const SkeletonThree = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20" />
      <div className="relative z-10 p-4 flex flex-row items-center h-full">
        <FaRecycle className="h-16 w-16 text-green-600 mr-4" />
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">Eco-Friendly Processing</h3>
          <p className="text-sm text-gray-600">94% Material Recovery Rate</p>
        </div>
      </div>
    </motion.div>
  )
}

const SkeletonFour = () => {
  const benefits = [
    { icon: FaChartLine, color: "bg-amber-100", text: "Cost Savings", tag: "Efficient Processes" },
    { icon: FaHeadset, color: "bg-blue-100", text: "24/7 Support", tag: "Reliable Assistance" },
  ]
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-amber-50 p-4 gap-4">
      {benefits.map((benefit, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-white rounded-xl p-4 flex flex-col items-center text-center border border-gray-100"
          whileHover={{ y: -5 }}
        >
          <div className={`${benefit.color} p-3 rounded-full mb-3`}>
            <benefit.icon className="h-6 w-6 text-gray-800" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">{benefit.text}</h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {benefit.tag}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

const SkeletonFive = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white rounded-xl p-4 w-full h-full border border-gray-100 flex flex-col items-center justify-center">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaFlask className="h-16 w-16 text-blue-400/20" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">49+</div>
            <p className="text-sm text-gray-600">Years Experience</p>
            <div className="mt-4 flex justify-center space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 w-6 bg-blue-400 rounded-full animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const items = [
  {
    title: "Regulatory Compliance",
    description: "Full compliance with EPA, OSHA, and international hazardous waste regulations",
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <FaShieldAlt className="h-4 w-4 text-blue-600" />
  },
  {
    title: "Custom Solutions",
    description: "Tailored chemical waste management plans for industrial and commercial needs",
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <GiChemicalTank className="h-4 w-4 text-amber-600" />
  },
  {
    title: "Sustainable Processing",
    description: "Environmentally responsible treatment with 94% material recovery rate",
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <FaRecycle className="h-4 w-4 text-green-600" />
  },
  {
    title: "Client Assurance",
    description: "Comprehensive support with 24/7 emergency response services",
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <FaHeadset className="h-4 w-4 text-blue-600" />
  },
  {
    title: "Industry Expertise",
    description: "Decades of specialized experience in chemical waste management",
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <FaChartLine className="h-4 w-4 text-green-600" />
  },
];