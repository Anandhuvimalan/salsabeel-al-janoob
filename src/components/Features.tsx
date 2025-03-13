"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

type Feature = {
  title: string
  description: string
  icon: string
  details: string[]
}

type FeaturesData = {
  heading: {
    title: string
    subtitle: string
  }
  features: Feature[]
  cta: {
    title: string
    subtitle: string
    linkText: string
    linkUrl: string
    icon: string
  }
}

export default function Features() {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([])
  const [featureData, setFeatureData] = useState<FeaturesData>({
    heading: { title: "", subtitle: "" },
    features: [],
    cta: { title: "", subtitle: "", linkText: "", linkUrl: "", icon: "" },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Supabase
        const { data, error } = await supabase
          .from("features_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        setFeatureData(data)
      } catch (err) {
        console.error("Error fetching features data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    elementsRef.current.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [featureData])

  // Update the renderIcon function to better handle SVG files
  const renderIcon = (iconName: string, altText: string, className = "h-6 w-6 text-slate-100") => {
    // Handle empty icon names
    if (!iconName || iconName.trim() === "") {
      return (
        <div className={className}>
          <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600">No icon</span>
          </div>
        </div>
      )
    }

    // Get the public URL for the icon from Supabase storage
    const iconUrl = supabase.storage.from("feature-icons").getPublicUrl(iconName).data.publicUrl

    return (
      <img
        src={iconUrl || "/placeholder.svg"}
        alt={`${altText} icon`}
        className={className}
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement
          target.onerror = null // Prevent infinite loop
          target.src = "/placeholder.svg"
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="w-full py-24 bg-gradient-to-b from-slate-900 to-slate-800 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-center text-red-200">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  const { heading, features, cta } = featureData

  return (
    <section className="w-full py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div ref={(el) => (elementsRef.current[0] = el)} className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400 mb-4">
            {heading.title}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">{heading.subtitle}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (elementsRef.current[index + 1] = el)}
              className="relative h-full p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700 hover:border-teal-400/30 transition-all duration-300 animate-fade-in"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center">
                    {renderIcon(feature.icon, feature.title)}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100">{feature.title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>

                <div className="mt-auto space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center text-sm text-teal-300/90">
                      <span className="w-2 h-2 bg-teal-400 rounded-full mr-2" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <div
            ref={(el) => (elementsRef.current[features.length + 1] = el)}
            className="md:col-span-2 xl:col-span-3 p-8 rounded-2xl bg-gradient-to-br from-teal-600/40 to-indigo-600/40 border border-teal-400/20 relative overflow-hidden animate-fade-in"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{cta.title}</h3>
                <p className="text-slate-300 text-sm max-w-2xl">{cta.subtitle}</p>
              </div>
              <Link
                href={cta.linkUrl}
                className="inline-flex items-center px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium rounded-lg transition-colors group shrink-0"
              >
                {cta.linkText}
                {renderIcon(cta.icon, "CTA", "ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-all")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

