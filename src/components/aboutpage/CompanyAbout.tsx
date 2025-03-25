"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface CompanyAboutData {
  left_column: {
    intro: {
      title: string
      description: string
    }
    founder: {
      title: string
      descriptionBefore: string
      founderName: string
      descriptionAfter: string
    }
    growth: {
      title: string
      description: string
    }
    timeline: Array<{
      label: string
      value?: string
      title?: string
      subtitle?: string
    }>
  }
  right_column: {
    globalExpansion: {
      title: string
      description: string
    }
    imageBlock: {
      image: {
        src: string
        alt: string
      }
    }
    legacy: {
      title: string
      description: string
    }
  }
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: CompanyAboutData = {
  left_column: {
    intro: {
      title: "Building Trust Since 1975",
      description:
        "Salsabeel Al Janoob's story began in 1975 in Oman, with a vision to connect local businesses with global markets through exceptional import and export services.",
    },
    founder: {
      title: "Founder's Vision",
      descriptionBefore: "Founder and Chairman,",
      founderName: "Khalfan Abdullah Khalfan Al Mandary",
      descriptionAfter:
        "instilled a commitment to integrity and customer focus, building a foundation for long-term growth.",
    },
    growth: {
      title: "Strategic Growth & Diversification",
      description:
        "Recognizing evolving market needs, we strategically diversified into waste management, retail consultancy, and more. This diversification leveraged our international network and market insights gained through our core trade business.",
    },
    timeline: [
      {
        label: "ESTABLISHED",
        value: "1975",
      },
      {
        label: "FOUNDED BY",
        title: "Khalfan Abdullah Khalfan Al Mandhari",
        subtitle: "Founder and Chairman",
      },
      {
        label: "PRESENCE",
        value: "Oman & India",
      },
    ],
  },
  right_column: {
    globalExpansion: {
      title: "Global Expansion",
      description:
        "Our recent expansion into India further strengthens our global reach, creating new opportunities for international collaboration and trade excellence.",
    },
    imageBlock: {
      image: {
        src: "company-about-1741727550108-hfibwegdziv.webp",
        alt: "Salsabeel Al Janoob company image",
      },
    },
    legacy: {
      title: "Continuing the Legacy",
      description:
        "Guided by our leadership team's expertise, we remain dedicated to innovation and sustainable growth, continuing to connect opportunities for clients worldwide while maintaining our core values of integrity and excellence.",
    },
  },
}

const CompanyAbout = () => {
  const [data, setData] = useState<CompanyAboutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: companyData, error } = await supabase
          .from("aboutpage_company")
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
            right_column: {
              ...FALLBACK_DATA.right_column,
              imageBlock: {
                image: {
                  ...FALLBACK_DATA.right_column.imageBlock.image,
                  src: processImageUrl(FALLBACK_DATA.right_column.imageBlock.image.src),
                },
              },
            },
          }

          setData(processedFallbackData)
          return
        }

        // Process fetched data
        if (
          companyData.right_column.imageBlock.image.src &&
          !companyData.right_column.imageBlock.image.src.startsWith("http") &&
          !companyData.right_column.imageBlock.image.src.startsWith("/")
        ) {
          companyData.right_column.imageBlock.image.src = processImageUrl(companyData.right_column.imageBlock.image.src)
        }

        setData(companyData)
      } catch (err) {
        console.error("Fetch error:", err)
        console.log("Using fallback data due to fetch error")

        // Process fallback data with image URL
        const processedFallbackData = {
          ...FALLBACK_DATA,
          right_column: {
            ...FALLBACK_DATA.right_column,
            imageBlock: {
              image: {
                ...FALLBACK_DATA.right_column.imageBlock.image,
                src: processImageUrl(FALLBACK_DATA.right_column.imageBlock.image.src),
              },
            },
          },
        }

        setData(processedFallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to process image URLs
  const processImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath
    return supabase.storage.from("aboutpage-company-images").getPublicUrl(imagePath).data.publicUrl
  }

  if (loading) {
    return (
      <section aria-label="Loading company information" role="region" className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="status" aria-live="polite" className="animate-pulse space-y-8">
            <div className="h-12 bg-zinc-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              <div className="h-4 bg-zinc-200 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 rounded w-full" />
              <div className="h-4 bg-zinc-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!data) {
    return null // This should never happen with fallback data
  }

  const leftColumn = data.left_column
  const rightColumn = data.right_column

  return (
    <section aria-label="Company information" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column */}
          <article className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-6">{leftColumn.intro.title}</h2>
              <p className="text-zinc-600 leading-relaxed">{leftColumn.intro.description}</p>
            </motion.div>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">{leftColumn.founder.title}</h3>
                <p className="text-zinc-600">
                  {leftColumn.founder.descriptionBefore}
                  <strong className="font-medium">{leftColumn.founder.founderName}</strong>
                  {leftColumn.founder.descriptionAfter}
                </p>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">{leftColumn.growth.title}</h3>
              <p className="text-zinc-600">{leftColumn.growth.description}</p>
            </motion.article>

            <nav aria-label="Company timeline">
              <ul className="space-y-8 pt-8">
                {leftColumn.timeline.map((event, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
                    className="relative pl-8 border-l-2 border-amber-200"
                  >
                    <div aria-hidden="true" className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-600" />
                    <h4 className="text-amber-600 text-sm font-medium">{event.label}</h4>
                    {event.value ? (
                      <p className="text-2xl font-bold text-zinc-900">{event.value}</p>
                    ) : (
                      <>
                        <p className="text-xl font-bold text-zinc-900">{event.title}</p>
                        <p className="text-zinc-600">{event.subtitle}</p>
                      </>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
          </article>

          {/* Right Column */}
          <aside className="space-y-8" aria-label="Additional company details">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-zinc-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">{rightColumn.globalExpansion.title}</h3>
                <p className="text-zinc-600">{rightColumn.globalExpansion.description}</p>
              </div>
            </motion.article>

            <motion.figure
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="relative h-64 bg-zinc-100 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ scaleX: 1 }}
                  whileInView={{ scaleX: 0 }}
                  transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1], delay: 0.4 }}
                  className="absolute inset-0 bg-white origin-right z-20"
                  aria-hidden="true"
                />
                <Image
                  src={rightColumn.imageBlock.image.src || "/placeholder.svg"}
                  alt={rightColumn.imageBlock.image.alt}
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
              </div>
              <figcaption className="sr-only">{rightColumn.imageBlock.image.alt}</figcaption>
            </motion.figure>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">{rightColumn.legacy.title}</h3>
                <p className="text-zinc-600">{rightColumn.legacy.description}</p>
              </div>
            </motion.article>
          </aside>
        </div>

        {/* Decorative timeline visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 border-t-2 border-zinc-200 relative h-1"
          aria-hidden="true"
        >
          <div className="absolute left-0 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
          <div className="absolute left-1/2 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
          <div className="absolute right-0 -top-[7px] w-3 h-3 rounded-full bg-amber-500" />
        </motion.div>
      </div>
    </section>
  )
}

export default CompanyAbout

