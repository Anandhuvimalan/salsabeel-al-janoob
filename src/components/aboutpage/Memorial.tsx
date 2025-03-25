"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"

interface MemorialData {
  full_message: string
  title: string
  name: string
  years: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: MemorialData = {
  full_message:
    "Mother, you are my inspiring and guiding light. With that thought and inspiration, we deliver our Best!",
  title: "In Loving Memory Of",
  name: "Syamala Devi",
  years: "1959 - 2019",
  image: {
    alt: "In Memory of Our Beloved Syamala Devi",
    src: "memorial-1741733334459-g2l1e6td1vp.webp",
    width: 240,
    height: 320,
  },
}

export default function MemorialSection() {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMemorialData() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_memorial")
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
            image: {
              ...FALLBACK_DATA.image,
              src: getImageUrl(FALLBACK_DATA.image.src),
            },
          }

          setMemorialData(processedFallbackData)
          return
        }

        // Process fetched data
        if (data.image.src && !data.image.src.startsWith("http") && !data.image.src.startsWith("/")) {
          data.image.src = getImageUrl(data.image.src)
        }

        setMemorialData(data)
      } catch (error) {
        console.error("Error fetching memorial data:", error)
        console.log("Using fallback data due to fetch error")

        // Process fallback data with image URL
        const processedFallbackData = {
          ...FALLBACK_DATA,
          image: {
            ...FALLBACK_DATA.image,
            src: getImageUrl(FALLBACK_DATA.image.src),
          },
        }

        setMemorialData(processedFallbackData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMemorialData()
  }, [])

  // Helper function to process image URLs
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("aboutpage-memorial-images").getPublicUrl(path).data.publicUrl
  }

  useEffect(() => {
    if (!memorialData) return
    if (currentIndex < memorialData.full_message.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + memorialData.full_message[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      const resetTimer = setTimeout(() => {
        setDisplayText("")
        setCurrentIndex(0)
      }, 5000)
      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, memorialData])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [displayText])

  if (isLoading) {
    return (
      <section
        aria-label="Loading memorial section"
        role="region"
        className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white"
      >
        <div role="status" aria-live="polite" className="animate-pulse space-y-8 flex flex-col items-center">
          <div className="h-64 w-48 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-24 w-full max-w-3xl bg-gray-200 rounded" />
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!memorialData) {
    return null // This should never happen with fallback data
  }

  return (
    <section
      aria-label="Memorial tribute"
      className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white"
    >
      <div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        aria-hidden="true"
      />

      <article className="relative mb-8">
        <div
          className="absolute inset-[-4px] bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-lg"
          aria-hidden="true"
        />
        <figure className="relative">
          <Image
            src={memorialData.image.src || "/placeholder.svg"}
            alt={`Portrait of ${memorialData.name}, ${memorialData.title}`}
            width={memorialData.image.width || 240}
            height={memorialData.image.height || 320}
            className="relative z-10 object-cover shadow-lg"
            priority
          />
        </figure>
      </article>

      <header className="text-center mb-12">
        <h2 className="font-serif text-3xl font-normal tracking-wide mb-1">{memorialData.title}</h2>
        <h3 className="font-serif text-2xl italic text-gray-700 mb-1">{memorialData.name}</h3>
        <p className="text-lg italic text-gray-600">{memorialData.years}</p>
      </header>

      <div className="relative w-full max-w-3xl min-h-[6rem] flex items-center justify-center">
        <div
          ref={containerRef}
          className="text-center p-4 bg-white overflow-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          <blockquote className="text-xl md:text-2xl text-gray-700 font-serif">
            {displayText}
            <span className="animate-pulse" aria-hidden="true">
              |
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

