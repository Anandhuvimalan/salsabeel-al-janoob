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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: ValuesData = {
  banner: "Our Core Values",
  section_heading: "Our Guiding Principles",
  values: [
    {
      icon: "value-0-1741728589163-ihualwyxcxs.svg",
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from the quality of our services to the level of customer service we provide.",
    },
    {
      icon: "value-1-1741728589163-kn048zefcaf.svg",
      title: "Integrity",
      description:
        "We conduct our business with the highest ethical standards, earning the trust of our clients and partners.",
    },
    {
      icon: "value-2-1741728589163-metj29ss8lj.svg",
      title: "Customer Focus",
      description: "We prioritize our clients' needs and are committed to exceeding their expectations.",
    },
    {
      icon: "value-3-1741728589163-hj1cozfj4u9.svg",
      title: "Innovation",
      description: "We embrace innovation and continuously seek new and better ways to serve our clients.",
    },
    {
      icon: "value-4-1741728589163-cscn9428aus.svg",
      title: "Sustainability",
      description: "We are committed to sustainable practices and minimizing our environmental impact.",
    },
    {
      icon: "value-5-1741728589164-1fojkv0056i.svg",
      title: "Collaboration",
      description: "We believe in the power of teamwork and building strong partnerships to achieve shared success.",
    },
  ],
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

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with icon URLs
          const processedFallbackValues = FALLBACK_DATA.values.map((value) => ({
            ...value,
            icon: getIconUrl(value.icon),
          }))

          setValuesData({
            ...FALLBACK_DATA,
            values: processedFallbackValues,
          })
          return
        }

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
        console.log("Using fallback data due to fetch error")

        // Process fallback data with icon URLs
        const processedFallbackValues = FALLBACK_DATA.values.map((value) => ({
          ...value,
          icon: getIconUrl(value.icon),
        }))

        setValuesData({
          ...FALLBACK_DATA,
          values: processedFallbackValues,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getIconUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("aboutpage-values-icons").getPublicUrl(path).data.publicUrl
  }

  if (isLoading) {
    return (
      <section aria-label="Loading values" role="region" className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="status" aria-live="polite" className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto" />
            <div className="h-10 bg-zinc-200 rounded w-1/2 mx-auto" />
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <li key={i} className="h-40 bg-zinc-200 rounded" />
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!valuesData) {
    return null // This should never happen with fallback data
  }

  return (
    <section aria-label="Company values" className="relative py-20 bg-white">
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
            {valuesData.banner}
          </span>
        </motion.header>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-12"
        >
          {valuesData.section_heading}
        </motion.h2>

        {/* Values Grid */}
        <motion.ul
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          role="list"
        >
          {valuesData.values.map((value, index) => (
            <motion.li
              key={index}
              className="bg-white p-6 rounded-xl border border-zinc-100 hover:border-amber-100 hover:bg-amber-50/20 transition-all group"
              role="listitem"
            >
              <article className="flex items-start gap-4">
                <figure className="p-3 bg-amber-100 rounded-lg" aria-hidden="true">
                  <Image
                    src={value.icon || "/placeholder.svg"}
                    alt={`Icon representing ${value.title}`}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    aria-hidden="true"
                  />
                </figure>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zinc-800 mb-2">{value.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{value.description}</p>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default ValuesSection

