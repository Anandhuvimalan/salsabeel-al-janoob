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

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: CallToActionData = {
  heading: "Ready to Elevate Your Business?",
  subheading: "Join us today and unlock unparalleled growth opportunities.",
  button_text: "Get Started",
  button_link: "/contact",
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

        const { data, error } = await supabase
          .from("aboutpage_calltoaction")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")
          setCallToActionData(FALLBACK_DATA)
          return
        }

        if (!data?.length) {
          console.log("No data found, using fallback data")
          setCallToActionData(FALLBACK_DATA)
          return
        }

        setCallToActionData(data[0])
      } catch (err) {
        console.error("Error fetching call to action data:", err)
        console.log("Using fallback data due to fetch error")
        setCallToActionData(FALLBACK_DATA)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <section aria-label="Loading call to action" role="region" className="py-16 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div role="status" aria-live="polite" className="space-y-5 animate-pulse">
            <div className="h-10 bg-amber-500 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-amber-500 rounded w-1/2 mx-auto" />
            <div className="mt-8 flex justify-center">
              <div className="h-12 w-32 bg-white rounded-md" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!callToActionData) {
    return null // This should never happen with fallback data
  }

  return (
    <section aria-label="Call to action" className="py-16 bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">{callToActionData.heading}</h2>
          <p className="text-lg text-white md:text-xl">{callToActionData.subheading}</p>
          <div className="mt-8">
            <Link
              href={callToActionData.button_link}
              className="inline-block px-8 py-3 bg-white text-amber-600 font-semibold rounded-md shadow hover:bg-gray-100 transition"
              aria-label={`${callToActionData.button_text} - ${callToActionData.heading}`}
            >
              {callToActionData.button_text}
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  )
}

export default CallToAction

