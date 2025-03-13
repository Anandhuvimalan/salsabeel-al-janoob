"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface HeroData {
  background: {
    image: string
    alt: string
  }
  content: {
    badge: string
    mainTitle: string
    highlightText: string
    description: string
    button: {
      text: string
      link: string
    }
  }
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await supabase
          .from("aboutpage_hero")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process image URL if it's from Supabase storage
        if (
          data.background.image &&
          !data.background.image.startsWith("http") &&
          !data.background.image.startsWith("/")
        ) {
          data.background.image = supabase.storage
            .from("aboutpage-hero-images")
            .getPublicUrl(data.background.image).data.publicUrl
        }

        setHeroData(data)
      } catch (err) {
        setError("Failed to load hero section content")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        <div className="animate-pulse bg-gray-200/50 w-full h-full" />
      </div>
    )
  }

  if (error || !heroData) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center text-red-500 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        {error || "Failed to load hero section"}
      </div>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroData.background.image || "/placeholder.svg"})` }}
      />

      {/* Curtain Reveal Effect */}
      <motion.div
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{
          duration: 1.5,
          ease: [0.645, 0.045, 0.355, 1],
          delay: 0.2,
        }}
        className="absolute inset-0 bg-zinc-950 origin-top z-20"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 text-center max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 text-xs sm:text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
        >
          {heroData.content.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white tracking-tight leading-tight"
        >
          {heroData.content.mainTitle}{" "}
          <span className="relative inline-block">
            {heroData.content.highlightText}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 2.3 }}
              className="absolute bottom-0 left-0 h-0.5 bg-white/30"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          {heroData.content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="flex gap-4"
        >
          <Link
            href={heroData.content.button.link}
            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-transform duration-300 ease-out hover:scale-105 text-sm sm:text-base font-medium"
          >
            <span className="relative z-20">{heroData.content.button.text}</span>
            <motion.div
              initial={false}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              className="absolute inset-0 z-10 bg-white/20"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection

