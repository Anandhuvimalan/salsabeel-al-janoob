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

        // Process icons to get full URLs
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

  // Helper function to get public URL for icons
  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("aboutpage-visionmission-icons").getPublicUrl(path).data.publicUrl
  }

  if (isLoading) {
    return (
      <section className="relative py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto"></div>
            <div className="h-10 bg-zinc-200 rounded w-1/2 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-zinc-200 rounded"></div>
              <div className="h-96 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !visionMissionData) {
    return (
      <section className="relative py-20 bg-zinc-50 text-center text-red-500">
        {error || "Failed to load vision & mission data"}
      </section>
    )
  }

  return (
    <section className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inline-banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {visionMissionData.inline_banner}
          </div>
        </motion.div>

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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-100"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.vision_card.icon || "/placeholder.svg"}
                  alt="Vision Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-800 mb-4">{visionMissionData.vision_card.title}</h3>
            <p className="text-zinc-600 text-lg leading-relaxed">{visionMissionData.vision_card.description}</p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100"
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Image
                  src={visionMissionData.mission_card.icon || "/placeholder.svg"}
                  alt="Mission Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-800 mb-6">{visionMissionData.mission_card.title}</h3>

            <div className="space-y-6">
              {visionMissionData.mission_card.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 text-amber-600">
                      <Image
                        src={item.icon || "/placeholder.svg"}
                        alt="Mission item icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                  <p className="text-zinc-600">
                    <strong>{item.strongText} </strong>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VisionMissionSection

