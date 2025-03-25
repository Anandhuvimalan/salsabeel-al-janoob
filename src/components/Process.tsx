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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: ProcessData = {
  section: {
    heading: "Our Seamless Import & Export Process",
    description: "Follow our step-by-step approach to experience hassle-free import and export services.",
    buttonLink: "/about",
    buttonText: "More About Us",
  },
  steps: [
    {
      title: "Consultation & Planning",
      description: "Discuss your needs and craft a tailored trade strategy.",
      iconSrc: "step-0-1741688888360-xbr80yttg5h.svg",
      hoverFrom: "hover:from-purple-600",
      hoverTo: "hover:to-purple-800",
      iconFrom: "from-purple-500",
      iconTo: "to-purple-700",
    },
    {
      title: "Documentation & Compliance",
      description: "We handle paperwork and ensure full regulatory compliance.",
      iconSrc: "step-1-1741688888360-r5a9jbg34i8.svg",
      hoverFrom: "hover:from-blue-600",
      hoverTo: "hover:to-blue-800",
      iconFrom: "from-blue-500",
      iconTo: "to-blue-700",
    },
    {
      title: "Logistics & Transportation",
      description: "Efficient shipping solutions to move your goods globally.",
      iconSrc: "step-2-1741688888360-rn0408nxcmf.svg",
      hoverFrom: "hover:from-red-600",
      hoverTo: "hover:to-red-800",
      iconFrom: "from-red-500",
      iconTo: "to-red-700",
    },
    {
      title: "Customs Clearance",
      description: "Expert management of customs procedures for smooth border crossings.",
      iconSrc: "step-3-1741688888361-yjnmobf4it.svg",
      hoverFrom: "hover:from-yellow-600",
      hoverTo: "hover:to-yellow-800",
      iconFrom: "from-yellow-500",
      iconTo: "to-yellow-700",
    },
    {
      title: "Delivery & After Service",
      description: "Reliable delivery and dedicated support after shipment.",
      iconSrc: "step-4-1741688888361-qllfuqt9x8.svg",
      hoverFrom: "hover:from-green-600",
      hoverTo: "hover:to-green-800",
      iconFrom: "from-green-500",
      iconTo: "to-green-700",
    },
    {
      title: "After Sales Support",
      description: "Continuous support and feedback to help your business thrive.",
      iconSrc: "step-5-1741688888361-7imw3ek70jc.svg",
      hoverFrom: "hover:from-orange-600",
      hoverTo: "hover:to-orange-800",
      iconFrom: "from-orange-500",
      iconTo: "to-orange-700",
    },
  ],
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
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-colors duration-300 hover:bg-gradient-to-br ${hoverFrom} ${hoverTo} hover:text-white`}
    >
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-full mb-6 transition-colors duration-300 bg-gradient-to-br ${iconFrom} ${iconTo} group-hover:bg-white`}
        aria-hidden="true"
      >
        <img
          src={iconSrc || "/placeholder.svg"}
          alt={`${title} icon`}
          className="w-8 h-8 transition-colors duration-300 brightness-0 invert"
          loading="lazy"
        />
      </div>
      <h3 className="text-2xl font-bold mb-3 group-hover:text-white">{title}</h3>
      <p className="text-gray-600 group-hover:text-white">{description}</p>
    </motion.li>
  )
}

export default function ImportExportProcess() {
  const [processData, setProcessData] = useState<ProcessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const { data, error } = await supabase
          .from("process_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Apply the getIconUrl function to the fallback data steps
          const fallbackWithFullUrls = {
            ...FALLBACK_DATA,
            steps: FALLBACK_DATA.steps.map((step) => ({
              ...step,
              iconSrc: getIconUrl(step.iconSrc),
            })),
          }

          setProcessData(fallbackWithFullUrls)
          return
        }

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
        console.log("Using fallback data due to fetch error")

        // Apply the getIconUrl function to the fallback data steps
        const fallbackWithFullUrls = {
          ...FALLBACK_DATA,
          steps: FALLBACK_DATA.steps.map((step) => ({
            ...step,
            iconSrc: getIconUrl(step.iconSrc),
          })),
        }

        setProcessData(fallbackWithFullUrls)
      } finally {
        setLoading(false)
      }
    }

    fetchProcessData()
  }, [])

  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("process-icons").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen" aria-label="Loading process section">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-hidden="true" />
      </main>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!processData) {
    return null // This should never happen with fallback data
  }

  return (
    <section
      aria-labelledby="process-heading"
      className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-24 font-sans overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2
            id="process-heading"
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4"
          >
            {processData.section.heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{processData.section.description}</p>
        </motion.header>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </ul>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href={processData.section.buttonLink}
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
            rel={processData.section.buttonLink.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={processData.section.buttonText}
          >
            {processData.section.buttonText}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

