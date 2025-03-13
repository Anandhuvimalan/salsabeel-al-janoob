"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface CompanyAboutData {
  left_column: {
    intro: {
      title: string
      description: string
    }
    founder: {
      title: string
      descriptionBefore: string
      founderName: string
      descriptionAfter: string
    }
    growth: {
      title: string
      description: string
    }
    timeline: Array<{
      label: string
      value?: string
      title?: string
      subtitle?: string
    }>
  }
  right_column: {
    globalExpansion: {
      title: string
      description: string
    }
    imageBlock: {
      image: {
        src: string
        alt: string
      }
    }
    legacy: {
      title: string
      description: string
    }
  }
}

const CompanyAbout = () => {
  const [data, setData] = useState<CompanyAboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: companyData, error } = await supabase
          .from("aboutpage_company")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process image URL if it's from Supabase storage
        if (
          companyData.right_column.imageBlock.image.src &&
          !companyData.right_column.imageBlock.image.src.startsWith("http") &&
          !companyData.right_column.imageBlock.image.src.startsWith("/")
        ) {
          companyData.right_column.imageBlock.image.src = supabase.storage
            .from("aboutpage-company-images")
            .getPublicUrl(companyData.right_column.imageBlock.image.src).data.publicUrl
        }

        setData(companyData)
      } catch (err) {
        setError("Failed to load company information")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="relative py-16 sm:py-20 md:py-24 bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            {/* Loading skeleton */}
            <div className="h-8 sm:h-12 bg-zinc-200 rounded w-1/2 mb-4 sm:mb-6" />
            <div className="space-y-3 sm:space-y-4">
              <div className="h-4 sm:h-5 bg-zinc-200 rounded w-3/4" />
              <div className="h-4 sm:h-5 bg-zinc-200 rounded w-full" />
              <div className="h-4 sm:h-5 bg-zinc-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="relative py-20 bg-white text-center text-red-500">
        {error || "Failed to load company information"}
      </div>
    )
  }

  // Rename variables to match the original component's expected structure
  const leftColumn = data.left_column
  const rightColumn = data.right_column

  return (
    <section
      id="company-about"
      className="relative py-16 sm:py-20 md:py-24 bg-white font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Intro Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 mb-4 sm:mb-6 tracking-tight leading-tight">
                {leftColumn.intro.title}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">{leftColumn.intro.description}</p>
            </motion.div>

            {/* Founder Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-l-4 border-amber-500 pl-3 sm:pl-4">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1 sm:mb-2">
                  {leftColumn.founder.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600">
                  {leftColumn.founder.descriptionBefore}
                  <span className="font-medium">{leftColumn.founder.founderName}</span>
                  {leftColumn.founder.descriptionAfter}
                </p>
              </div>
            </motion.div>

            {/* Growth Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1 sm:mb-2">
                {leftColumn.growth.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600">{leftColumn.growth.description}</p>
            </motion.div>

            {/* Timeline Section */}
            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8">
              {leftColumn.timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                  className="relative pl-6 sm:pl-8 border-l-2 border-amber-200"
                >
                  <div className="absolute left-[-8px] sm:left-[-9px] top-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-600" />
                  <p className="text-xs sm:text-sm text-amber-600 font-medium">{event.label}</p>
                  {event.value ? (
                    <p className="text-xl sm:text-2xl font-bold text-zinc-900">{event.value}</p>
                  ) : (
                    <>
                      <p className="text-base sm:text-xl font-bold text-zinc-900">{event.title}</p>
                      <p className="text-sm sm:text-base text-zinc-600">{event.subtitle}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Global Expansion Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-zinc-50 p-4 sm:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1 sm:mb-2">
                  {rightColumn.globalExpansion.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600">{rightColumn.globalExpansion.description}</p>
              </div>
            </motion.div>

            {/* Image Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="relative h-64 bg-zinc-100 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ scaleX: 1 }}
                  whileInView={{ scaleX: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.645, 0.045, 0.355, 1],
                    delay: 0.4,
                  }}
                  className="absolute inset-0 bg-white origin-right z-20"
                />
                <Image
                  src={rightColumn.imageBlock.image.src || "/placeholder.svg"}
                  alt={rightColumn.imageBlock.image.alt}
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
              </div>
            </motion.div>

            {/* Legacy Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="bg-amber-50 p-4 sm:p-6 rounded-lg border border-amber-100">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-800 mb-1 sm:mb-2">
                  {rightColumn.legacy.title}
                </h3>
                <p className="text-sm sm:text-base text-zinc-600">{rightColumn.legacy.description}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 border-t-2 border-zinc-200 relative h-1"
        >
          <div className="absolute left-0 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
          <div className="absolute left-1/2 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
          <div className="absolute right-0 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
        </motion.div>
      </div>
    </section>
  )
}

export default CompanyAbout

