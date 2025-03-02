"use client"
import { cn } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { motion } from "framer-motion"
import { FaHandsHelping, FaHeartbeat, FaBrain, FaUsers, FaRegClock } from "react-icons/fa"
import { GiSpiralArrow, GiMeditation } from "react-icons/gi"

export default function CounselingBenefits() {
  return (
    <section className="py-20 bg-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Compassionate Recovery <span className="text-purple-600">Support</span>
        </h2>
        
        <BentoGrid>
          {counselingItems.map((item, i) => (
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

const TherapyProcess = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-purple-50 to-pink-50 flex-col p-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      <div className="flex flex-col h-full justify-between">
        {['Assessment', 'Planning', 'Treatment', 'Aftercare'].map((stage, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">{i + 1}</span>
            </div>
            <h3 className="font-semibold text-gray-800">{stage} Phase</h3>
            {i < 3 && <GiSpiralArrow className="ml-auto text-gray-300" />}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const HolisticApproach = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-purple-50 relative p-4"
      whileHover={{ scale: 1.02 }}
    >
      <div className="grid grid-cols-2 gap-4 h-full">
        {['Mind', 'Body', 'Spirit', 'Community'].map((aspect, i) => (
          <div key={i} className="bg-white rounded-lg p-3 flex flex-col items-center">
            <GiMeditation className={`w-6 h-6 ${i % 2 ? 'text-purple-600' : 'text-blue-600'}`} />
            <span className="text-sm text-gray-600 mt-1 text-center">{aspect}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const SuccessStats = () => {
  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-pink-50 to-purple-50 p-4"
      initial={{ scale: 0.95 }}
      whileInView={{ scale: 1 }}
    >
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl font-bold text-purple-600">95%</div>
          <div className="text-sm text-gray-600">Recovery Rate</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl font-bold text-purple-600">1k+</div>
          <div className="text-sm text-gray-600">Lives Changed</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl">
          <div className="text-2xl font-bold text-purple-600">15+</div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
      </div>
    </motion.div>
  )
}

const TherapyMethods = () => {
  const methods = [
    { icon: <FaBrain className="w-5 h-5" />, name: "CBT" },
    { icon: <FaHandsHelping className="w-5 h-5" />, name: "Group Therapy" },
    { icon: <FaHeartbeat className="w-5 h-5" />, name: "Holistic Care" },
    { icon: <FaUsers className="w-5 h-5" />, name: "Family Support" },
  ]

  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-white to-purple-50 p-4"
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col justify-center w-full">
        {methods.map((method, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="p-2 bg-purple-100 rounded-lg">{method.icon}</div>
            <span className="font-medium text-gray-800">{method.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const counselingItems = [
  {
    title: "Personalized Recovery Plans",
    description: "Tailored treatment strategies for sustainable sobriety",
    header: <TherapyProcess />,
    className: "md:col-span-2",
    icon: <FaRegClock className="h-4 w-4 text-purple-600" />
  },
  {
    title: "Holistic Healing Approach",
    description: "Addressing mind, body, and emotional wellness",
    header: <HolisticApproach />,
    className: "md:col-span-1",
    icon: <GiMeditation className="h-4 w-4 text-blue-600" />
  },
  {
    title: "Proven Success Metrics",
    description: "Transparent results-driven care",
    header: <SuccessStats />,
    className: "md:col-span-2",
    icon: <FaHeartbeat className="h-4 w-4 text-pink-600" />
  },
  {
    title: "Diverse Therapy Methods",
    description: "Evidence-based treatment modalities",
    header: <TherapyMethods />,
    className: "md:col-span-1",
    icon: <FaUsers className="h-4 w-4 text-purple-600" />
  },
];