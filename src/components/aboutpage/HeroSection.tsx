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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: HeroData = {
  background: {
    image: "about-hero-1741725878940-yqlxa2is62.webp",
    alt: "salsabeel-al-janoob-imp-exp-company-image",
  },
  content: {
    badge: "SERVING OMAN AND INDIA",
    mainTitle: "Salsabeel Al Janoob:",
    highlightText: "Your Trusted Partner",
    description:
      "For nearly five decades, Salsabeel Al Janoob has been a cornerstone of trust and reliability. We offer a comprehensive range of services, from international trade to specialized consulting, tailored to meet your unique needs. Discover how we can help you achieve your goals.",
    button: {
      text: "Learn More About Us",
      link: "#company-about",
    },
  },
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

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with image URL
          const processedFallbackData = {
            ...FALLBACK_DATA,
            background: {
              ...FALLBACK_DATA.background,
              image: processImageUrl(FALLBACK_DATA.background.image),
            },
          }

          setHeroData(processedFallbackData)
          return
        }

        // Process fetched data
        const processedData = {
          ...data,
          background: {
            ...data.background,
            image: processImageUrl(data.background.image),
          },
        }

        setHeroData(processedData)
      } catch (err) {
        console.error("Fetch error:", err)
        console.log("Using fallback data due to fetch error")

        // Process fallback data with image URL
        const processedFallbackData = {
          ...FALLBACK_DATA,
          background: {
            ...FALLBACK_DATA.background,
            image: processImageUrl(FALLBACK_DATA.background.image),
          },
        }

        setHeroData(processedFallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  // Helper function to process image URLs
  const processImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath
    return supabase.storage.from("aboutpage-hero-images").getPublicUrl(imagePath).data.publicUrl
  }

  const isExternalLink = (url: string) => url.startsWith("http")

  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="animate-pulse bg-gray-200/50 w-full h-full" />
      </div>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!heroData) {
    return null // This should never happen with fallback data
  }

  return (
    <header className="relative h-screen overflow-hidden" aria-live="polite" role="banner">
      {/* Background Image with accessibility features */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroData.background.image || "/placeholder.svg"})` }}
        role="img"
        aria-label={heroData.background.alt}
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
        aria-hidden="true"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
          role="status"
        >
          {heroData.content.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {heroData.content.mainTitle}{" "}
          <span className="relative inline-block">
            {heroData.content.highlightText}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 2.3 }}
              className="absolute bottom-0 left-0 h-0.5 bg-white/30"
              aria-hidden="true"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {heroData.content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="flex gap-4"
        >
          {isExternalLink(heroData.content.button.link) ? (
            <a
              href={heroData.content.button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-transform duration-300 ease-out hover:scale-105"
              aria-label={`${heroData.content.button.text} (opens in new tab)`}
            >
              <span className="relative z-20 font-medium tracking-wide">{heroData.content.button.text}</span>
              <motion.div
                initial={false}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                className="absolute inset-0 z-10 bg-white/20"
                aria-hidden="true"
              />
            </a>
          ) : (
            <Link
              href={heroData.content.button.link}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-transform duration-300 ease-out hover:scale-105"
              aria-label={heroData.content.button.text}
            >
              <span className="relative z-20 font-medium tracking-wide">{heroData.content.button.text}</span>
              <motion.div
                initial={false}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                className="absolute inset-0 z-10 bg-white/20"
                aria-hidden="true"
              />
            </Link>
          )}
        </motion.div>
      </div>
    </header>
  )
}

export default HeroSection

