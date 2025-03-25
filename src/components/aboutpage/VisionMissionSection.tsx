"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

interface MissionItem {
  icon: string
  strongText: string
  text: string
}

interface VisionMissionData {
  inline_banner: string
  main_heading: string
  vision_card: {
    icon: string
    title: string
    description: string
  }
  mission_card: {
    icon: string
    title: string
    items: MissionItem[]
  }
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: VisionMissionData = {
  inline_banner: "Vision & Mission",
  main_heading: "Defining Our Path, Shaping the Future",
  vision_card: {
    icon: "vision-icon-1741730134307-zz1berwsken.svg",
    title: "Our Vision",
    description:
      "To be a globally recognized leader in integrated solutions, renowned for connecting businesses and individuals to opportunities worldwide. We aspire to be the preferred partner for clients seeking comprehensive and reliable services, setting the standard for excellence in international trade, diverse business solutions, and community enrichment. We envision a future where Salsabeel Al Janoob is synonymous with trust, innovation, and sustainable growth, contributing positively to the economic and social well-being of the communities we serve.",
  },
  mission_card: {
    icon: "mission-icon-1741730296779-rkcicvry0gp.svg",
    title: "Our Mission",
    items: [
      {
        icon: "mission-item-0-1741730296779-1tuzfxky05k.svg",
        strongText: "Facilitating seamless international trade:",
        text: "Connecting businesses with global markets through efficient and reliable import and export solutions.",
      },
      {
        icon: "mission-item-1-1741730296779-w43zcs9dpr.svg",
        strongText: "Delivering comprehensive business solutions:",
        text: "Offering diverse services from waste management to retail consultancy, tailored to evolving client needs.",
      },
      {
        icon: "mission-item-2-1741730296779-ozy0cdre6ds.svg",
        strongText: "Fostering personal and professional growth:",
        text: "Providing counseling and educational resources to empower individual potential.",
      },
      {
        icon: "mission-item-3-1741730296779-9hxwuda8sbl.svg",
        strongText: "Upholding ethical standards:",
        text: "Conducting business with integrity, transparency, and accountability.",
      },
      {
        icon: "mission-item-4-1741730296779-8kklt6g37ax.svg",
        strongText: "Embracing innovation & sustainability:",
        text: "Developing sustainable solutions while minimizing environmental impact.",
      },
      {
        icon: "mission-item-5-1741730296779-jau0umt6gfl.svg",
        strongText: "Building strong relationships:",
        text: "Nurturing partnerships based on mutual respect and trust.",
      },
    ],
  },
}

const VisionMissionSection = () => {
  const [visionMissionData, setVisionMissionData] = useState<VisionMissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVisionMissionData() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_visionmission")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with icon URLs
          const processedFallbackData = {
            ...FALLBACK_DATA,
            vision_card: {
              ...FALLBACK_DATA.vision_card,
              icon: getIconUrl(FALLBACK_DATA.vision_card.icon),
            },
            mission_card: {
              ...FALLBACK_DATA.mission_card,
              icon: getIconUrl(FALLBACK_DATA.mission_card.icon),
              items: FALLBACK_DATA.mission_card.items.map((item) => ({
                ...item,
                icon: getIconUrl(item.icon),
              })),
            },
          }

          setVisionMissionData(processedFallbackData)
          return
        }

        const processedData = {
          ...data,
          vision_card: {
            ...data.vision_card,
            icon: getIconUrl(data.vision_card.icon),
          },
          mission_card: {
            ...data.mission_card,
            icon: getIconUrl(data.mission_card.icon),
            items: data.mission_card.items.map((item: MissionItem) => ({
              ...item,
              icon: getIconUrl(item.icon),
            })),
          },
        }

        setVisionMissionData(processedData)
      } catch (error) {
        console.error("Error fetching vision & mission data:", error)
        console.log("Using fallback data due to fetch error")

        // Process fallback data with icon URLs
        const processedFallbackData = {
          ...FALLBACK_DATA,
          vision_card: {
            ...FALLBACK_DATA.vision_card,
            icon: getIconUrl(FALLBACK_DATA.vision_card.icon),
          },
          mission_card: {
            ...FALLBACK_DATA.mission_card,
            icon: getIconUrl(FALLBACK_DATA.mission_card.icon),
            items: FALLBACK_DATA.mission_card.items.map((item) => ({
              ...item,
              icon: getIconUrl(item.icon),
            })),
          },
        }

        setVisionMissionData(processedFallbackData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVisionMissionData()
  }, [])

  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("aboutpage-visionmission-icons").getPublicUrl(path).data.publicUrl
  }

  if (isLoading) {
    return (
      <section aria-label="Loading vision and mission" role="region" className="relative py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="status" aria-live="polite" className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto" />
            <div className="h-10 bg-zinc-200 rounded w-1/2 mx-auto" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-zinc-200 rounded" />
              <div className="h-96 bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!visionMissionData) {
    return null // This should never happen with fallback data
  }

  return (
    <section aria-label="Vision and mission" className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {visionMissionData.inline_banner}
          </span>
        </motion.header>

        {/* Main Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-16"
        >
          {visionMissionData.main_heading}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Vision Card */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-100"
            aria-labelledby="vision-heading"
          >
            <div className="mb-6">
              <figure className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.vision_card.icon || "/placeholder.svg"}
                  alt={`${visionMissionData.vision_card.title} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  aria-hidden="true"
                />
              </figure>
            </div>
            <h3 id="vision-heading" className="text-2xl font-bold text-zinc-800 mb-4">
              {visionMissionData.vision_card.title}
            </h3>
            <p className="text-zinc-600 text-lg leading-relaxed">{visionMissionData.vision_card.description}</p>
          </motion.article>

          {/* Mission Card */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100"
            aria-labelledby="mission-heading"
          >
            <div className="mb-6">
              <figure className="w-16 h-16 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.mission_card.icon || "/placeholder.svg"}
                  alt={`${visionMissionData.mission_card.title} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  aria-hidden="true"
                />
              </figure>
            </div>
            <h3 id="mission-heading" className="text-2xl font-bold text-zinc-800 mb-6">
              {visionMissionData.mission_card.title}
            </h3>

            <ul className="space-y-6" aria-label="Mission objectives">
              {visionMissionData.mission_card.items.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <figure className="flex-shrink-0" aria-hidden="true">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 text-amber-600"
                      aria-hidden="true"
                    />
                  </figure>
                  <p className="text-zinc-600">
                    <strong>{item.strongText} </strong>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

export default VisionMissionSection

