"use client"
import { GlareCard } from "@/components/ui/glare-card"
import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface ServiceCardProps {
  title: string
  description: string
  features: string[]
  iconSrc: string
  arrowIcon: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, features, iconSrc, arrowIcon }) => {
  return (
    <GlareCard className="group flex flex-col p-6 sm:p-8 w-full max-w-sm hover:scale-105 transition-all duration-300 ease-in-out h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700 ease-in-out" />

      <motion.div
        className="flex-1 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-6">
          <img src={iconSrc || "/placeholder.svg"} alt={title} className="w-8 h-8 text-white/80 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-3 leading-tight">{title}</h2>
          <p className="text-sm text-neutral-200 leading-relaxed">{description}</p>
        </div>

        <ul className="list-none space-y-3 text-sm text-white/90">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start group/item">
              <img
                src={arrowIcon || "/placeholder.svg"}
                alt="Arrow right"
                className="mr-2 w-4 h-4 mt-0.5 text-white/70 transform group-hover/item:translate-x-1 transition-transform duration-200"
              />
              <span className="group-hover/item:text-white transition-colors duration-200">{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </GlareCard>
  )
}

export function GlareCardDemo() {
  const [data, setData] = useState<{ section: any; services: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: whatWeDoData, error } = await supabase
          .from("whatwedo_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process the data to include full URLs for icons
        const processedData = {
          section: {
            ...whatWeDoData.section,
            icons: {
              ...whatWeDoData.section.icons,
              arrowRight: getIconUrl(whatWeDoData.section.icons.arrowRight),
            },
          },
          services: whatWeDoData.services.map((service: any) => ({
            ...service,
            iconSrc: getIconUrl(service.iconSrc),
          })),
        }

        setData(processedData)
      } catch (err) {
        console.error("Error fetching what we do data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper function to get public URL for icons
  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("whatwedo-icons").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
  }

  if (!data) return null

  return (
    <section className="py-16 md:py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-full transform hover:scale-105 transition-transform duration-200">
            {data.section.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{data.section.heading}</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{data.section.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4">
          {data.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <ServiceCard {...service} arrowIcon={data.section.icons.arrowRight} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GlareCardDemo