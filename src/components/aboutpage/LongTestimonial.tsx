"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: TestimonialsData = {
  header: {
    title: "Voices of Success",
    banner: "Trusted Across Industries",
    subheading: "Testimonials from valued partners and clients worldwide",
  },
  columns: {
    column1: [
      {
        alt: "Ahmed Ali",
        img: "testimonial-column1-0-1741732944922-xphpxfkjjum.webp",
        name: "Ahamed Ali",
        role: "International Trade Partner",
        text: "Salsabeel Al Janoob demonstrates expertise in chemical specialization and waste management, ensuring innovative, safe, and reliable solutions for all challenges.",
      },
      {
        alt: "Karthik K",
        img: "testimonial-column1-1-1741732944924-fm35p9v0hol.webp",
        name: "Karthik K",
        role: "Construction Project Manager",
        text: "Karthik K's project management expertise accelerated our infrastructure development through innovative planning, execution, and exceptional attention to detail throughout projects.",
      },
      {
        alt: "Fatima K khan",
        img: "testimonial-column1-2-1741732944924-7vga9ujuang.webp",
        name: "Fatima k khan",
        role: "Waste Management Director",
        text: "Fatima K khan commends the outstanding efficiency and innovative approach in waste management that consistently delivers sustainable, environmentally responsible outcomes.",
      },
    ],
    column2: [
      {
        alt: "Priya S Nair",
        img: "testimonial-column2-0-1741732944924-7i4e4pcg94e.webp",
        name: "Priya S Nair",
        role: "Retail Chain Owner",
        text: "Our retail consultancy revitalized our business model, boosting engagement and significantly increasing profitability.",
      },
      {
        alt: "Arshita Aaron",
        img: "testimonial-column2-1-1741732944924-ubg9z18quz.webp",
        name: "Arshita Aaron",
        role: "Corporate Trainer",
        text: "Corporate training programs empowered our workforce, driving productivity improvements and enhancing essential skills.",
      },
      {
        alt: "Roshan S",
        img: "testimonial-column2-2-1741732944924-dt6rurtn81b.webp",
        name: "Roshan S",
        role: "Global Trade CEO",
        text: "Roshan S provides a global vision with exceptional leadership, steering strategic market growth.",
      },
    ],
    column3: [
      {
        alt: "Sujith S Sudharsan",
        img: "testimonial-column3-0-1741732944925-800z4lljr29.webp",
        name: "Sujith S Sudharsan",
        role: "Government Contracts",
        text: "Exceptional business partnership",
      },
      {
        alt: "Aaliya Aleem",
        img: "testimonial-column3-1-1741732944925-ml3sj90314h.webp",
        name: "Aaliya Aleem",
        role: "Career Counseling Client",
        text: "Innovative logistics solutions",
      },
      {
        alt: "Mohammed Shan",
        img: "testimonial-column3-2-1741732944925-8sxgzucoz55.webp",
        name: "Mohammed Shan",
        role: "Educational Partner",
        text: "Exemplary educational partnership",
      },
      {
        alt: "Thasni Thanseer",
        img: "testimonial-column3-3-1741732944925-vz7e1pfp5f.webp",
        name: "Thasni Thanseer",
        role: "Logistics Partner",
        text: "Seamless global logistics",
      },
    ],
  },
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

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Process fallback data with image URLs
          const processedFallbackData = {
            ...FALLBACK_DATA,
            columns: {
              column1: processTestimonialImages(FALLBACK_DATA.columns.column1),
              column2: processTestimonialImages(FALLBACK_DATA.columns.column2),
              column3: processTestimonialImages(FALLBACK_DATA.columns.column3),
            },
          }

          setTestimonialsData(processedFallbackData)
          return
        }

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
        console.log("Using fallback data due to fetch error")

        // Process fallback data with image URLs
        const processedFallbackData = {
          ...FALLBACK_DATA,
          columns: {
            column1: processTestimonialImages(FALLBACK_DATA.columns.column1),
            column2: processTestimonialImages(FALLBACK_DATA.columns.column2),
            column3: processTestimonialImages(FALLBACK_DATA.columns.column3),
          },
        }

        setTestimonialsData(processedFallbackData)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const processTestimonialImages = (testimonials: Testimonial[]): Testimonial[] => {
    return testimonials.map((testimonial) => ({
      ...testimonial,
      img: getImageUrl(testimonial.img),
    }))
  }

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("aboutpage-testimonials-images").getPublicUrl(path).data.publicUrl
  }

  const renderCard = (testimonial: Testimonial) => (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-sm leading-6"
      role="listitem"
    >
      <article className="relative group">
        <div
          className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-amber-300 to-amber-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"
          aria-hidden="true"
        />
        <div className="relative p-6 space-y-6 leading-none rounded-lg bg-white ring-1 ring-zinc-200">
          <div className="flex items-center space-x-4">
            <Image
              src={testimonial.img || "/placeholder.svg"}
              width={48}
              height={48}
              className="w-12 h-12 border rounded-full object-cover"
              alt={`Portrait of ${testimonial.name}, ${testimonial.role}`}
              aria-hidden={!testimonial.img}
            />
            <div>
              <h3 className="text-lg font-semibold text-zinc-800">{testimonial.name}</h3>
              <p className="text-zinc-500">{testimonial.role}</p>
            </div>
          </div>
          <blockquote className="leading-normal text-zinc-600">
            <p>{testimonial.text}</p>
          </blockquote>
        </div>
      </article>
    </motion.li>
  )

  if (isLoading) {
    return (
      <section aria-label="Loading testimonials" role="region" className="relative py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="status" aria-live="polite" className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto" />
            <div className="h-10 bg-zinc-200 rounded w-1/2 mx-auto" />
            <div className="h-6 bg-zinc-200 rounded w-3/4 mx-auto" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <li key={i} className="h-48 bg-zinc-200 rounded" />
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!testimonialsData) {
    return null // This should never happen with fallback data
  }

  return (
    <section aria-label="Customer testimonials" className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-5 md:mb-16 md:text-center"
        >
          <span className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {testimonialsData.header.banner}
          </span>
          <h2 className="mb-5 text-3xl font-bold text-zinc-800 md:text-4xl">{testimonialsData.header.title}</h2>
          <p className="text-lg text-zinc-600 md:text-xl">{testimonialsData.header.subheading}</p>
        </motion.header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" role="list">
          {/* Column 1 */}
          <ul className="space-y-8" aria-label="Testimonials column 1">
            {testimonialsData.columns.column1.map((testimonial, index) => (
              <React.Fragment key={index}>{renderCard(testimonial)}</React.Fragment>
            ))}
          </ul>

          {/* Column 2 */}
          <ul className="space-y-8 hidden lg:block" aria-label="Testimonials column 2">
            {testimonialsData.columns.column2.map((testimonial, index) => (
              <React.Fragment key={index}>{renderCard(testimonial)}</React.Fragment>
            ))}
          </ul>

          {/* Column 3 */}
          <ul className="space-y-8 hidden lg:block" aria-label="Testimonials column 3">
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

