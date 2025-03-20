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

        const { count, error: countError } = await supabase
          .from("aboutpage_calltoaction")
          .select("*", { count: "exact", head: true })

        if (countError) throw new Error("Failed to check data existence")

        if (count === 0) {
          const defaultData = {
            heading: "Ready to Elevate Your Business?",
            subheading: "Join us today and unlock unparalleled growth opportunities.",
            button_text: "Get Started",
            button_link: "/contact",
          }

          const { error: insertError } = await supabase.from("aboutpage_calltoaction").insert(defaultData)
          if (insertError) throw new Error("Failed to initialize data")
        }

        const { data, error } = await supabase
          .from("aboutpage_calltoaction")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)

        if (error || !data?.length) throw new Error("Data not found")

        setCallToActionData(data[0])
      } catch (err) {
        setError("Failed to load call to action data. Please refresh the page.")
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

  if (error) {
    return (
      <section className="py-16 bg-amber-600" role="alert" aria-live="assertive">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white">{error}</p>
        </div>
      </section>
    )
  }

  if (!callToActionData) return null

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