"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

interface CallToActionData {
  heading: string
  subheading: string
  button_text: string
  button_link: string
}

const CallToAction = () => {
  const [callToActionData, setCallToActionData] = useState<CallToActionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Check if the table has any data
        const { count, error: countError } = await supabase
          .from("aboutpage_calltoaction")
          .select("*", { count: "exact", head: true })

        if (countError) {
          console.error("Error checking call to action data:", countError)
          throw new Error("Failed to check if data exists")
        }

        // If no data exists, insert default data
        if (count === 0) {
          const defaultData = {
            heading: "Ready to Elevate Your Business?",
            subheading: "Join us today and unlock unparalleled growth opportunities.",
            button_text: "Get Started",
            button_link: "/contact",
          }

          const { error: insertError } = await supabase.from("aboutpage_calltoaction").insert(defaultData)

          if (insertError) {
            console.error("Error inserting default data:", insertError)
            throw new Error("Failed to initialize call to action data")
          }
        }

        // Now fetch the data
        const { data, error } = await supabase
          .from("aboutpage_calltoaction")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)

        if (error) {
          console.error("Supabase query error:", error)
          throw new Error("Failed to fetch call to action data")
        }

        if (!data || data.length === 0) {
          console.error("No data returned from query")
          throw new Error("No call to action data found")
        }

        setCallToActionData({
          heading: data[0].heading,
          subheading: data[0].subheading,
          button_text: data[0].button_text,
          button_link: data[0].button_link,
        })
      } catch (err) {
        console.error("Error fetching call to action data:", err)
        setError("Failed to load call to action data. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-amber-600 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-4 sm:space-y-5 animate-pulse">
            <div className="h-8 sm:h-10 bg-amber-500 rounded w-3/4 mx-auto"></div>
            <div className="h-5 sm:h-6 bg-amber-500 rounded w-1/2 mx-auto"></div>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="h-10 sm:h-12 w-28 sm:w-32 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white">{error}</p>
        </div>
      </section>
    )
  }

  if (!callToActionData) return null

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-amber-600 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
            {callToActionData.heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {callToActionData.subheading}
          </p>
          <div className="mt-8">
            <Link
              href={callToActionData.button_link}
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-amber-600 font-medium rounded-full shadow hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base"
            >
              {callToActionData.button_text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction

