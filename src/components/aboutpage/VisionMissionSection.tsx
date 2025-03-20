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

        if (error) throw error

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
        setError("Failed to load vision & mission data")
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

  if (error || !visionMissionData) {
    return (
      <section 
        className="relative py-20 bg-zinc-50 text-center text-red-500" 
        role="alert" 
        aria-live="assertive"
      >
        {error || "Failed to load vision & mission data"}
      </section>
    )
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