"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

interface ValueItem {
  title: string
  description: string
  icon: string
}

interface ValuesData {
  banner: string
  section_heading: string
  values: ValueItem[]
}

const ValuesSection = () => {
  const [valuesData, setValuesData] = useState<ValuesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_values")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process icons to get full URLs if they're from Supabase storage
        const processedValues = data.values.map((value: ValueItem) => ({
          ...value,
          icon: getIconUrl(value.icon),
        }))

        setValuesData({
          banner: data.banner,
          section_heading: data.section_heading,
          values: processedValues,
        })
      } catch (error) {
        console.error("Error fetching values data:", error)
        setError("Failed to load values data")
      } finally {
        setIsLoading(false)
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
    return supabase.storage.from("aboutpage-values-icons").getPublicUrl(path).data.publicUrl
  }

  if (isLoading) {
    return (
      <div className="relative py-16 sm:py-20 md:py-24 bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="h-6 sm:h-8 bg-zinc-200 rounded w-1/4 mx-auto"></div>
            <div className="h-8 sm:h-10 bg-zinc-200 rounded w-1/2 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 sm:h-40 bg-zinc-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !valuesData) {
    return (
      <div className="relative py-16 sm:py-20 md:py-24 bg-white text-center text-red-500 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        {error || "Failed to load values data"}
      </div>
    )
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Inline-banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-3 sm:mb-4"
        >
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {valuesData.banner}
          </div>
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-8 sm:mb-10 md:mb-12 tracking-tight leading-tight"
        >
          {valuesData.section_heading}
        </motion.h2>

        {/* Values Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {valuesData.values.map((value, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl border border-zinc-100 hover:border-amber-100 hover:bg-amber-50/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 sm:p-3 bg-amber-100 rounded-lg">
                  <Image
                    src={value.icon || "/placeholder.svg"}
                    alt={`${value.title} icon`}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-800 mb-1 sm:mb-2">{value.title}</h3>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ValuesSection

