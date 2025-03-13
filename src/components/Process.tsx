"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

type ProcessStep = {
  title: string
  description: string
  iconSrc: string
  hoverFrom: string
  hoverTo: string
  iconFrom: string
  iconTo: string
}

type ProcessData = {
  section: {
    heading: string
    description: string
    buttonLink: string
    buttonText: string
  }
  steps: ProcessStep[]
}

const ProcessStepCard = ({
  title,
  description,
  iconSrc,
  delay,
  hoverFrom,
  hoverTo,
  iconFrom,
  iconTo,
}: {
  title: string
  description: string
  iconSrc: string
  delay: number
  hoverFrom: string
  hoverTo: string
  iconFrom: string
  iconTo: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center transition-colors duration-300 hover:bg-gradient-to-br ${hoverFrom} ${hoverTo} hover:text-white`}
    >
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 transition-colors duration-300 bg-gradient-to-br ${iconFrom} ${iconTo} group-hover:bg-white`}
      >
        <img
          src={iconSrc || "/placeholder.svg"}
          alt={title}
          className="w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 brightness-0 invert"
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-white">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 group-hover:text-white leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function ImportExportProcess() {
  const [processData, setProcessData] = useState<ProcessData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const { data, error } = await supabase
          .from("process_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Transform steps to include full URLs for icons
        const stepsWithFullUrls = data.steps.map((step: ProcessStep) => ({
          ...step,
          iconSrc: getIconUrl(step.iconSrc),
        }))

        setProcessData({
          section: data.section,
          steps: stepsWithFullUrls,
        })
      } catch (error) {
        console.error("Error fetching process data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProcessData()
  }, [])

  // Helper function to get public URL for icons
  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("process-icons").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!processData) {
    return (
      <div className="text-center text-red-500 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-base sm:text-lg">Failed to load process data.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-16 sm:py-20 md:py-24 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3 sm:mb-4 tracking-tight leading-tight">
            {processData.section.heading}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {processData.section.description}
          </p>
        </motion.div>

        <div className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {processData.steps.map((step, index) => (
            <ProcessStepCard
              key={index}
              title={step.title}
              description={step.description}
              iconSrc={step.iconSrc}
              delay={index * 0.1}
              hoverFrom={step.hoverFrom}
              hoverTo={step.hoverTo}
              iconFrom={step.iconFrom}
              iconTo={step.iconTo}
            />
          ))}
        </div>

        <motion.div
          className="mt-8 sm:mt-10 md:mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href={processData.section.buttonLink}
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium text-sm sm:text-base rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            {processData.section.buttonText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

