"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

interface Testimonial {
  img: string
  alt: string
  name: string
  role: string
  text: string
}

interface TestimonialsData {
  header: {
    banner: string
    title: string
    subheading: string
  }
  columns: {
    column1: Testimonial[]
    column2: Testimonial[]
    column3: Testimonial[]
  }
}

const Testimonials = () => {
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_testimonials")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process testimonial images to get full URLs
        const processedData = {
          ...data,
          columns: {
            column1: processTestimonialImages(data.columns.column1),
            column2: processTestimonialImages(data.columns.column2),
            column3: processTestimonialImages(data.columns.column3),
          },
        }

        setTestimonialsData(processedData)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
        setError("Failed to load testimonials data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Helper function to process testimonial images
  const processTestimonialImages = (testimonials: Testimonial[]): Testimonial[] => {
    return testimonials.map((testimonial) => ({
      ...testimonial,
      img: getImageUrl(testimonial.img),
    }))
  }

  // Helper function to get public URL for images
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("aboutpage-testimonials-images").getPublicUrl(path).data.publicUrl
  }

  const renderCard = (testimonial: Testimonial) => (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-xs sm:text-sm leading-6"
    >
      <div className="relative group">
        <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-amber-300 to-amber-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
        <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-6 leading-none rounded-lg bg-white ring-1 ring-zinc-200">
          <div className="flex items-center space-x-4">
            <img
              src={testimonial.img || "/placeholder.svg"}
              className="w-12 h-12 border rounded-full object-cover"
              alt={testimonial.alt}
            />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-800">{testimonial.name}</h3>
              <p className="text-zinc-500">{testimonial.role}</p>
            </div>
          </div>
          <p className="leading-normal text-sm sm:text-base text-zinc-600">{testimonial.text}</p>
        </div>
      </div>
    </motion.li>
  )

  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20 md:py-24 bg-zinc-50 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="h-6 sm:h-8 bg-zinc-200 rounded w-1/4 mx-auto"></div>
            <div className="h-8 sm:h-10 bg-zinc-200 rounded w-1/2 mx-auto"></div>
            <div className="h-5 sm:h-6 bg-zinc-200 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 sm:h-48 bg-zinc-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !testimonialsData) {
    return (
      <section className="relative py-20 bg-zinc-50 text-center text-red-500">
        {error || "Failed to load testimonials data"}
      </section>
    )
  }

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-zinc-50 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12 space-y-4 sm:space-y-5 md:text-center"
        >
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {testimonialsData.header.banner}
          </div>
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 tracking-tight leading-tight">
            {testimonialsData.header.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            {testimonialsData.header.subheading}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Column 1 – Always visible */}
          <ul className="space-y-8">
            {testimonialsData.columns.column1.map((testimonial, index) => (
              <React.Fragment key={index}>{renderCard(testimonial)}</React.Fragment>
            ))}
          </ul>

          {/* Column 2 – Hidden on mobile/tablet */}
          <ul className="space-y-8 hidden lg:block">
            {testimonialsData.columns.column2.map((testimonial, index) => (
              <React.Fragment key={index}>{renderCard(testimonial)}</React.Fragment>
            ))}
          </ul>

          {/* Column 3 – Hidden on mobile/tablet */}
          <ul className="space-y-8 hidden lg:block">
            {testimonialsData.columns.column3.map((testimonial, index) => (
              <React.Fragment key={index}>{renderCard(testimonial)}</React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

