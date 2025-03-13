"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

interface TestimonialItem {
  name: string
  title: string
  message: string
  image: string
}

interface TestimonialData {
  section: {
    heading: string
    descriptions: string[]
  }
  testimonials: TestimonialItem[]
}

const Testimonial: React.FC = () => {
  const [data, setData] = useState<TestimonialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: testimonialData, error } = await supabase
          .from("testimonials_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        // Process testimonials to include full image URLs
        const processedData = {
          section: testimonialData.section,
          testimonials: testimonialData.testimonials.map((testimonial: TestimonialItem) => ({
            ...testimonial,
            image: getImageUrl(testimonial.image),
          })),
        }

        setData(processedData)
      } catch (err) {
        console.error("Error fetching testimonials:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to get public URL for images
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("testimonial-images").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-base sm:text-lg">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const {
    section: { heading, descriptions },
    testimonials,
  } = data

  const totalTestimonials = testimonials.length
  const containerHeight = `${totalTestimonials * 100}vh`

  return (
    <div className="w-full bg-gray-100 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="flex flex-col max-w-7xl px-4 sm:px-6 mx-auto lg:flex-row min-h-screen text-gray-800">
        {/* Left Section with animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 h-screen w-full lg:w-1/2 bg-gray-100 p-4 sm:p-6 lg:p-10 flex flex-col justify-start items-center lg:justify-center lg:items-start"
        >
          <div className="max-w-xl text-center pl-0 lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500 mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
              {heading}
            </h1>
            {descriptions.map((text, idx) => (
              <p key={idx} className="text-base sm:text-lg text-gray-700 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Right Section (Sticky Scrolling Container) */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <div
            className="relative w-full max-w-2xl flex flex-col justify-center px-4"
            style={{ height: containerHeight }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="sticky top-0 h-screen flex items-center justify-center"
                style={{ zIndex: index + 1 }}
              >
                <div className="bg-white rounded-2xl shadow-xl border border-indigo-200 w-full max-w-sm h-auto sm:h-[430px] flex flex-col items-center justify-between p-6 sm:p-10 mt-6 sm:mt-10 md:mt-0 lg:mt-0">
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-indigo-200 ring-offset-2">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col items-center flex-grow justify-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-indigo-600">{testimonial.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{testimonial.title}</p>
                    <blockquote className="text-sm sm:text-base leading-relaxed text-gray-600 mt-3 sm:mt-4 text-center">
                      "{testimonial.message}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonial

