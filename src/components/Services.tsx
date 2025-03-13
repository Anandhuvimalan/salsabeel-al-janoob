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

const CoreServices = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [servicesData, setServicesData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)

  // Update isMobile state based on viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch services data from Supabase on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services_section")
          .select("*")
          .order("id", { ascending: false })
          .limit(1)
          .single()

        if (error) throw error

        setServicesData({
          sectionTitle: data.section_title,
          services: data.services,
        })
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // Helper function to get public URL for images
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"

    // If the path is already a full URL or starts with /, return it as is
    if (path.startsWith("http") || path.startsWith("/")) {
      return path
    }

    // Otherwise, get the public URL from Supabase storage
    return supabase.storage.from("services-images").getPublicUrl(path).data.publicUrl
  }

  if (loading || !servicesData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <section className="bg-gray-900 text-gray-300 py-16 sm:py-20 md:py-24 w-full overflow-hidden font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif]">
      <div className="mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-12 md:mb-16 text-center text-gray-100 leading-tight tracking-tight">
          {servicesData.sectionTitle}
        </h1>

        {isMobile ? (
          // ------------------- MOBILE VIEW -------------------
          <div className="space-y-0">
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <Link key={service.id} href={url}>
                  <div className="flex items-center border-b border-gray-700 py-4 cursor-pointer">
                    <div className="w-3/4 text-left">
                      <h2 className="text-base sm:text-lg font-bold text-gray-200 mb-1">{service.title}</h2>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{service.description}</p>
                    </div>
                    <div className="w-1/4 flex justify-end items-center">
                      <div
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${service.gradient}`}
                      >
                        <Image
                          src={getImageUrl(service.image) || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          // ------------------- DESKTOP VIEW -------------------
          <motion.div className="space-y-0" initial="rest" whileHover="hover" animate="rest">
            {servicesData.services.map((service) => {
              const url = `/${service.title.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <motion.div key={service.id} className="overflow-hidden">
                  <Link href={url}>
                    <motion.div
                      className="relative block border-b border-gray-700 py-4 cursor-pointer overflow-hidden h-full rounded-md"
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                    >
                      {/* Animated background gradient */}
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
                      />

                      <div className="relative z-10 flex items-center justify-between h-full w-full">
                        {/* Number animation */}
                        <div className="absolute top-0 left-1 flex">
                          <span className="text-gray-400 text-xs sm:text-sm font-bold">0</span>
                          <div className="overflow-hidden w-4 sm:w-5 h-5 sm:h-6">
                            <motion.div
                              variants={{
                                rest: { y: 0 },
                                hover: {
                                  y: -24,
                                  transition: { duration: 0.3, ease: "easeInOut" },
                                },
                              }}
                            >
                              <span className="block h-5 sm:h-6 text-gray-400 text-xs sm:text-sm font-bold">
                                {service.id}
                              </span>
                              <span className="block h-5 sm:h-6 text-gray-400 text-xs sm:text-sm font-bold">
                                {service.id}
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Title */}
                        <motion.div
                          className="w-2/4 text-left pl-6 sm:pl-8"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: 20, transition: { duration: 0.5 } },
                          }}
                        >
                          <h2 className="text-base sm:text-lg font-bold text-gray-200">{service.title}</h2>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          className="w-2/4 text-left"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: 20, transition: { duration: 0.5 } },
                          }}
                        >
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{service.description}</p>
                        </motion.div>

                        {/* Image container with animated swap */}
                        <motion.div
                          className="w-1/4 flex justify-end"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: -10, transition: { duration: 0.5 } },
                          }}
                        >
                          <div
                            className={`relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br ${service.gradient}`}
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
                              <div className="relative w-full h-12 sm:h-16">
                                <Image
                                  src={getImageUrl(service.image) || "/placeholder.svg"}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="relative w-full h-12 sm:h-16">
                                <Image
                                  src={getImageUrl(service.image) || "/placeholder.svg"}
                                  alt={service.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default CoreServices

