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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA = {
  section: {
    badge: "Our Services",
    heading: "What We Do For Our Clients",
    description:
      "We deliver comprehensive solutions tailored to your needs. Explore our range of specialized services designed to empower your success.",
    accentColor: "#EF4444",
    icons: {
      arrowRight: "arrowIcon-1741690040750-mbdgkfl5uj.svg",
    },
  },
  services: [
    {
      title: "Comprehensive Civil Solutions",
      iconSrc: "service-0-1741690291831-w5m9zry0yt.svg",
      description:
        "Our expert team delivers complete project management, innovative design, efficient demolition, expert landscaping, and precision installations.",
      features: ["Full-cycle project planning", "Innovative construction design", "Sustainable & energy-efficient"],
    },
    {
      title: "State-of-the-Art Laundry Operations",
      iconSrc: "service-1-1741690291831-1kyf0r0rmc7.svg",
      description:
        "Leveraging cutting-edge machinery and advanced technology, we offer high-quality, reliable laundry services for commercial and residential needs.",
      features: ["Advanced cleaning technology", "Tailored service packages", "Rapid turnaround times"],
    },
    {
      title: "Global Retail & Trade Expertise",
      iconSrc: "service-2-1741690291831-mu8m5ftua6e.svg",
      description:
        "We streamline international commerce with seamless export-import services, strategic market insights, and innovative retail solutions.",
      features: ["International market insights", "Strategic retail partnerships", "Innovative trade solutions"],
    },
    {
      title: "Holistic Consultancy & Counseling",
      iconSrc: "service-3-1741690291831-eb2tgpuovy.svg",
      description:
        "Our comprehensive advisory services thoroughly and effectively cover career strategies, HR consulting, language training, and empathetic counseling.",
      features: ["Personalized career planning", "Expert HR consulting", "Counseling support"],
    },
  ],
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, features, iconSrc, arrowIcon }) => {
  return (
    <GlareCard className="group flex flex-col p-6 sm:p-8 w-full max-w-sm hover:scale-105 transition-all duration-300 ease-in-out h-full relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700 ease-in-out"
        aria-hidden="true"
      />

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

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with icon URLs
          const processedFallbackData = {
            section: {
              ...FALLBACK_DATA.section,
              icons: {
                ...FALLBACK_DATA.section.icons,
                arrowRight: getIconUrl(FALLBACK_DATA.section.icons.arrowRight),
              },
            },
            services: FALLBACK_DATA.services.map((service: any) => ({
              ...service,
              iconSrc: getIconUrl(service.iconSrc),
            })),
          }

          setData(processedFallbackData)
          return
        }

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
        console.log("Using fallback data due to fetch error")

        // Process fallback data with icon URLs
        const processedFallbackData = {
          section: {
            ...FALLBACK_DATA.section,
            icons: {
              ...FALLBACK_DATA.section.icons,
              arrowRight: getIconUrl(FALLBACK_DATA.section.icons.arrowRight),
            },
          },
          services: FALLBACK_DATA.services.map((service: any) => ({
            ...service,
            iconSrc: getIconUrl(service.iconSrc),
          })),
        }

        setData(processedFallbackData)
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-hidden="true" />
      </main>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!data) {
    return null // This should never happen with fallback data
  }

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
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{data.section.description}</p>
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

