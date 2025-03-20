"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { supabase } from "@/lib/supabaseClient"

interface Profile {
  image: { src: string; alt: string }
  name: string
  role: string
  description: string
  contacts?: {
    phone?: string[]
    email?: string
  }
}

interface LeadershipData {
  banner: string
  heading: string
  profiles: Profile[]
}

const LeadershipSection = () => {
  const [leadershipData, setLeadershipData] = useState<LeadershipData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("aboutpage_leadership")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        const processedData = {
          ...data,
          profiles: data.profiles.map((profile: Profile) => ({
            ...profile,
            image: {
              ...profile.image,
              src: getImageUrl(profile.image.src),
            },
          })),
        }

        setLeadershipData(processedData)
      } catch (error) {
        console.error("Error fetching leadership data:", error)
        setError("Failed to load leadership data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("aboutpage-leadership-images").getPublicUrl(path).data.publicUrl
  }

  const curtainTransition = {
    duration: 1.2,
    ease: [0.645, 0.045, 0.355, 1],
    delay: 0.4,
  }

  if (isLoading) {
    return (
      <section aria-label="Loading leadership team" role="region" className="relative py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="status" aria-live="polite" className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto" />
            <div className="h-10 bg-zinc-200 rounded w-1/2 mx-auto" />
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <li key={i} className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-64 bg-zinc-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-zinc-200 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 rounded w-1/2" />
                    <div className="h-16 bg-zinc-200 rounded" />
                    <div className="h-4 bg-zinc-200 rounded w-2/3" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }

  if (error || !leadershipData) {
    return (
      <section 
        className="relative py-20 bg-zinc-50 text-center text-red-500"
        role="alert"
        aria-live="assertive"
      >
        {error || "Failed to load leadership data"}
      </section>
    )
  }

  return (
    <section aria-label="Leadership team" className="relative py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
            {leadershipData.banner}
          </span>
        </motion.header>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-zinc-800 text-center mb-12"
        >
          {leadershipData.heading}
        </motion.h2>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipData.profiles.map((profile, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px", once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <article>
                <div className="relative h-64 bg-zinc-100">
                  <motion.div
                    initial={{ scaleY: 1 }}
                    whileInView={{ scaleY: 0 }}
                    viewport={{ margin: "-100px", once: true }}
                    transition={curtainTransition}
                    className="absolute inset-0 bg-amber-600 origin-top z-20"
                    aria-hidden="true"
                  />
                  <Image
                    src={profile.image.src || "/placeholder.svg"}
                    alt={`Portrait of ${profile.name}, ${profile.role}`}
                    fill
                    className="object-cover z-10"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-800 mb-2">{profile.name}</h3>
                    <p className="text-amber-600 font-medium mb-4">{profile.role}</p>
                    <p className="text-zinc-600 mb-4">{profile.description}</p>
                  </div>
                  {profile.contacts && (
                    <address className="mt-auto space-y-3 text-zinc-600 not-italic">
                      {profile.contacts.phone?.map((phone, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <PhoneIcon className="w-5 h-5 text-amber-600" aria-hidden="true" />
                          <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="hover:text-amber-600 transition-colors duration-300"
                            aria-label={`Phone number: ${phone}`}
                          >
                            {phone}
                          </a>
                        </div>
                      ))}
                      {profile.contacts.email && (
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-5 h-5 text-amber-600" aria-hidden="true" />
                          <a
                            href={`mailto:${profile.contacts.email}`}
                            className="hover:text-amber-600 transition-colors duration-300"
                            aria-label={`Email address: ${profile.contacts.email}`}
                          >
                            {profile.contacts.email}
                          </a>
                        </div>
                      )}
                    </address>
                  )}
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LeadershipSection