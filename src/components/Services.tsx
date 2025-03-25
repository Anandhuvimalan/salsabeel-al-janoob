"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

type Service = {
  id: number
  title: string
  image: string
  description: string
  gradient: string
}

type ServicesData = {
  sectionTitle: string
  services: Service[]
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: ServicesData = {
  sectionTitle: "More Than Just Import & Export",
  services: [
    {
      id: 1,
      image: "service-0-1741681438382-36k6rkkhbrv.webp",
      title: "Chemical Waste Management",
      gradient: "from-purple-500 to-purple-700",
      description: "Safe and efficient management of chemical waste materials.",
    },
    {
      id: 2,
      image: "service-1-1741681438383-yvxnzi5xg2m.webp",
      title: "All Waste Management",
      gradient: "from-blue-500 to-blue-700",
      description: "End-to-end waste management solutions for all types of waste.",
    },
    {
      id: 3,
      image: "service-2-1741681438383-wlor0piyztp.webp",
      title: "Civil Contracts",
      gradient: "from-red-500 to-red-700",
      description: "From design to construction, landscaping, and maintenance.",
    },
    {
      id: 4,
      image: "service-3-1741681438383-qk9diqjorb.webp",
      title: "Laundry Services",
      gradient: "from-teal-500 to-teal-700",
      description: "Professional laundry services for businesses and individuals.",
    },
    {
      id: 5,
      image: "service-4-1741681438383-bsr3ohini68.webp",
      title: "Retail Consultancy",
      gradient: "from-indigo-500 to-indigo-700",
      description: "Expert advice for 24x7 stores, restaurants, and supermarkets.",
    },
    {
      id: 6,
      image: "service-5-1741681438383-yzizpeoapgh.webp",
      title: "Educational & Career Guidance",
      gradient: "from-green-500 to-green-700",
      description: "Guiding students toward the right educational and career paths.",
    },
    {
      id: 7,
      image: "service-6-1741681438383-4ci0wiym57o.webp",
      title: "Foreign Language Learning Centers",
      gradient: "from-pink-500 to-pink-700",
      description: "Learn foreign languages with expert trainers.",
    },
    {
      id: 8,
      image: "service-7-1741681438383-0xememlrgubb.webp",
      title: "Vasthu Consultancy",
      gradient: "from-gray-500 to-gray-700",
      description: "Traditional Vasthu advice for your home and workspace.",
    },
    {
      id: 9,
      image: "service-8-1741681438383-zd83vy90z1c.webp",
      title: "Marriage & Family Counselling",
      gradient: "from-yellow-500 to-yellow-700",
      description: "Counseling for healthy relationships and family harmony.",
    },
    {
      id: 10,
      image: "service-9-1741681438383-dmdjipyk9r9.webp",
      title: "Drug Addiction Counseling",
      gradient: "from-orange-500 to-orange-700",
      description: "Helping individuals overcome addiction with professional guidance.",
    },
  ],
}

const CoreServices = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [servicesData, setServicesData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services_section")
          .select("*")
          .order("id", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")
          setServicesData(FALLBACK_DATA)
          return
        }

        setServicesData({
          sectionTitle: data.section_title,
          services: data.services,
        })
      } catch (error) {
        console.error("Error fetching services:", error)
        console.log("Using fallback data due to fetch error")
        setServicesData(FALLBACK_DATA)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http") || path.startsWith("/")) return path
    return supabase.storage.from("services-images").getPublicUrl(path).data.publicUrl
  }

  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-screen" aria-label="Loading services">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" aria-hidden="true" />
      </section>
    )
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!servicesData) {
    return null // This should never happen with fallback data
  }

  return (
    <section
      aria-labelledby="services-heading"
      className="bg-gray-900 text-gray-300 py-12 sm:py-16 md:py-20 w-full overflow-hidden"
    >
      <div className="mx-auto px-6 lg:px-10">
        <h2
          id="services-heading"
          className="text-4xl md:text-5xl font-bold mb-16 md:mb-24 text-center text-gray-100 leading-snug md:leading-relaxed"
        >
          {servicesData.sectionTitle}
        </h2>

        {isMobile ? (
          <ul className="space-y-0">
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <li key={service.id}>
                  <Link href={url} className="block border-b border-gray-700 py-4">
                    <article className="flex items-center">
                      <div className="w-3/4 text-left">
                        <h3 className="text-lg font-bold text-gray-200">{service.title}</h3>
                        <p className="text-sm text-gray-400 leading-tight">{service.description}</p>
                      </div>
                      <div className="w-1/4 flex justify-end items-center">
                        <div className={`relative w-16 h-16 rounded-lg bg-gradient-to-br ${service.gradient}`}>
                          <Image
                            src={getImageUrl(service.image) || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <motion.ul className="space-y-0" initial="rest" whileHover="hover" animate="rest">
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <motion.li key={service.id} className="overflow-hidden">
                  <Link href={url}>
                    <motion.article
                      className="relative block border-b border-gray-700 py-4 cursor-pointer overflow-hidden h-full rounded-md"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      aria-labelledby={`service-${service.id}-title`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-b ${service.gradient} rounded-md pointer-events-none z-0`}
                        variants={{
                          rest: { scaleY: 0 },
                          hover: {
                            scaleY: 1,
                            transition: { duration: 0.5, ease: "easeOut" },
                          },
                        }}
                        style={{ originY: "bottom" }}
                        aria-hidden="true"
                      />

                      <div className="relative z-10 flex items-center justify-between h-full w-full">
                        <div className="absolute top-0 left-1 flex" aria-hidden="true">
                          <span className="text-gray-400 text-sm font-bold">0</span>
                          <div className="overflow-hidden w-5 h-6">
                            <motion.div
                              variants={{
                                rest: { y: 0 },
                                hover: {
                                  y: -24,
                                  transition: { duration: 0.3, ease: "easeInOut" },
                                },
                              }}
                            >
                              <span className="block h-6 text-gray-400 text-sm font-bold">{service.id}</span>
                              <span className="block h-6 text-gray-400 text-sm font-bold">{service.id}</span>
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          className="w-2/4 text-left pl-8"
                          variants={{
                            rest: { x: 0 },
                            hover: {
                              x: 20,
                              transition: { duration: 0.5 },
                            },
                          }}
                        >
                          <h3 id={`service-${service.id}-title`} className="text-lg font-bold text-gray-200">
                            {service.title}
                          </h3>
                        </motion.div>

                        <motion.div
                          className="w-2/4 text-left"
                          variants={{
                            rest: { x: 0 },
                            hover: {
                              x: 20,
                              transition: { duration: 0.5 },
                            },
                          }}
                        >
                          <p className="text-sm text-gray-300">{service.description}</p>
                        </motion.div>

                        <motion.div
                          className="w-1/4 flex justify-end"
                          variants={{
                            rest: { x: 0 },
                            hover: {
                              x: -10,
                              transition: { duration: 0.5 },
                            },
                          }}
                        >
                          <div
                            className={`relative w-16 h-16 overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br ${service.gradient}`}
                          >
                            <motion.div
                              className="absolute inset-0 flex flex-col"
                              variants={{
                                rest: { y: 0 },
                                hover: {
                                  y: -64,
                                  transition: { duration: 0.5 },
                                },
                              }}
                              style={{ height: "128px" }}
                            >
                              <div className="relative w-full h-16">
                                <Image
                                  src={getImageUrl(service.image) || "/placeholder.svg"}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div className="relative w-full h-16">
                                <Image
                                  src={getImageUrl(service.image) || "/placeholder.svg"}
                                  alt=""
                                  aria-hidden="true"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </div>
    </section>
  )
}

export default CoreServices

