"use client"
import { GlareCard } from "@/components/ui/glare-card"
import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

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
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700 ease-in-out" 
           aria-hidden="true" />

      <motion.div
        className="flex-1 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-6">
          <img 
            src={iconSrc || "/placeholder.svg"} 
            alt={`${title} icon`} 
            className="w-8 h-8 text-white/80 mb-4" 
            loading="lazy"
          />
          <h2 className="text-xl font-semibold text-white mb-3 leading-tight">{title}</h2>
          <p className="text-sm text-neutral-200 leading-relaxed">{description}</p>
        </div>

        <ul className="list-none space-y-3 text-sm text-white/90">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start group/item">
              <img
                src={arrowIcon || "/placeholder.svg"}
                alt=""
                aria-hidden="true"
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

  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("whatwedo-icons").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen" aria-label="Loading services">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          aria-hidden="true"
        />
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen" aria-label="Services error">
        <article className="text-center p-8 max-w-md">
          <h2 role="alert" className="text-xl font-bold text-red-500 mb-4">
            Loading Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Retry loading services"
          >
            Try Again
          </button>
        </article>
      </main>
    )
  }

  if (!data) return null

  return (
    <section aria-labelledby="services-heading" className="py-16 md:py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {data.section.badge && (
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-neutral-100 text-neutral-800 rounded-full transform hover:scale-105 transition-transform duration-200">
              {data.section.badge}
            </span>
          )}
          <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {data.section.heading}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {data.section.description}
          </p>
        </motion.header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4">
          {data.services.map((service, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              aria-labelledby={`service-${index}-title`}
            >
              <ServiceCard {...service} arrowIcon={data.section.icons.arrowRight} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default GlareCardDemo