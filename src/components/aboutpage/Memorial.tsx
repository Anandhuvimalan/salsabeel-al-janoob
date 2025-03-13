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

export default function MemorialSection() {
  const [memorialData, setMemorialData] = useState<MemorialData | null>(null)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch memorial data from Supabase on mount
  useEffect(() => {
    async function fetchMemorialData() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_memorial")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process image URL if it's from Supabase storage
        if (data.image.src && !data.image.src.startsWith("http") && !data.image.src.startsWith("/")) {
          data.image.src = supabase.storage
            .from("aboutpage-memorial-images")
            .getPublicUrl(data.image.src).data.publicUrl
        }

        setMemorialData(data)
      } catch (error) {
        console.error("Error fetching memorial data:", error)
        setError("Failed to load memorial data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMemorialData()
  }, [])

  // Typewriter effect for full_message
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
      }, 5000) // Increased to 5 seconds to allow more time to read the full message
      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, memorialData])

  // Auto-scroll container on text update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [displayText])

  if (isLoading) {
    return (
      <section className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-pulse space-y-8 flex flex-col items-center">
          <div className="h-64 w-48 bg-gray-200 rounded"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-24 w-full max-w-3xl bg-gray-200 rounded"></div>
        </div>
      </section>
    )
  }

  if (error || !memorialData) {
    return (
      <section className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="text-red-500 text-center">{error || "Failed to load memorial data"}</div>
      </section>
    )
  }

  return (
    <section className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Memorial Image */}
      <div className="relative mb-8">
        <div className="absolute inset-[-4px] bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-lg" />
        <div className="relative">
          <Image
            src={memorialData.image.src || "/placeholder.svg"}
            alt={memorialData.image.alt}
            width={memorialData.image.width || 240}
            height={memorialData.image.height || 320}
            className="relative z-10 object-cover shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Title, Name, and Years */}
      <h2 className="font-serif text-3xl font-normal tracking-wide mb-1">{memorialData.title}</h2>
      <h3 className="font-serif text-2xl italic text-gray-700 mb-1">{memorialData.name}</h3>
      <p className="text-lg italic text-gray-600 mb-12">{memorialData.years}</p>

      {/* Animated Message */}
      <div className="relative w-full max-w-3xl min-h-[6rem] flex items-center justify-center">
        <div ref={containerRef} className="text-center p-4 bg-white overflow-hidden">
          <p className="text-xl md:text-2xl text-gray-700 font-serif">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    </section>
  )
}

