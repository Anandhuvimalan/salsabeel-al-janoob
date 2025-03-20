"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Mail } from "lucide-react"
import NavbarMobile from "@/components/NavBar/NavbarMobile"
import { supabase } from "@/lib/supabaseClient"

const NavbarDesktop = () => {
  const [services, setServices] = useState<
    Array<{
      id: number
      title: string
      image: string
      description: string
      gradient: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState(0)
  const [preloadedImages, setPreloadedImages] = useState<Record<number, string>>({})
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavHovered, setIsNavHovered] = useState(false)

  useEffect(() => {
    const preload = async () => {
      const images: Record<number, string> = {}
      for (const [index, service] of services.entries()) {
        images[index] = getImageUrl(service.image)
      }
      setPreloadedImages(images)
    }

    if (services.length > 0) {
      preload()
    }
  }, [services])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50)
      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

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
        setServices(data.services)
      } catch (error) {
        console.error("Error fetching services:", error)
        setError(error instanceof Error ? error.message : "Failed to load services")
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

  const hasBackground = isScrolled || isNavHovered

  if (loading || services.length === 0) {
    return (
      <nav 
        aria-label="Main navigation loading" 
        className="hidden lg:block fixed top-0 left-0 w-full z-[100] py-4 bg-gray-900/95 backdrop-blur-sm text-white shadow-lg"
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Home">
            <Image 
              src="/logo.svg" 
              alt="Company logo" 
              width={45} 
              height={45} 
              className="rounded-full"
              aria-hidden="true"
            />
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Salsabeel Al Janoob Imp Exp
              </span>
              <div className="tracking-wide text-sm text-gray-300">
                Your gateway to the international market
              </div>
            </div>
          </Link>
          <div className="animate-pulse flex space-x-8 items-center" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </nav>
    )
  }

  if (error) {
    return (
      <nav 
        aria-label="Navigation error" 
        className="hidden lg:block fixed top-0 left-0 w-full z-[100] py-4 bg-red-900/80 backdrop-blur-sm text-white shadow-lg"
      >
        <div className="container mx-auto px-6 text-center">
          Error loading navigation: {error}
        </div>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Main navigation"
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
      className={`hidden lg:block fixed top-0 left-0 w-full z-[100] py-4 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${hasBackground ? "bg-gray-900/95 backdrop-blur-sm text-white shadow-lg" : "bg-transparent text-white"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center" aria-label="Home">
        <Image 
          src="/logo.svg" 
          alt="Salsabeel Al Janoob Import Export Logo" 
          width={45} 
          height={45} 
          className="rounded-full"
        />
        <div className="ml-3">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Salsabeel Al Janoob Imp Exp
          </div>
          <div className="tracking-wide text-sm text-gray-300">
            Your gateway to the international market
          </div>
        </div>
      </Link>

        <div className="hidden lg:flex space-x-8 items-center">
          <Link
            href="/"
            className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium"
            aria-current="page"
          >
            Home
          </Link>

          <div
            className="group relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={isServicesOpen}
              aria-controls="services-menu"
              className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium flex items-center space-x-1"
              onClick={() => setIsServicesOpen((prev) => !prev)}
            >
              <span>Services</span>
              <ChevronDown 
                className="h-4 w-4 transition-transform duration-300 transform group-hover:rotate-180" 
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  id="services-menu"
                  role="menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="fixed left-0 right-0 w-full bg-gray-900/95 backdrop-blur-md text-white z-40 shadow-2xl border-t border-gray-800 mt-2"
                >
                  <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-5">
                        <div className="relative h-[65vh] w-full rounded-lg overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={hoveredServiceIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="absolute inset-0"
                            >
                              <div className="relative h-full w-full">
                                <Image
                                  src={preloadedImages[hoveredServiceIndex] || "/placeholder.svg"}
                                  alt={services[hoveredServiceIndex]?.title || ""}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="space-y-3"
                                  >
                                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                      {services[hoveredServiceIndex]?.title}
                                    </h2>
                                    <p className="text-lg text-gray-200 max-w-lg">
                                      {services[hoveredServiceIndex]?.description}
                                    </p>
                                    <Link
                                      href={`/${services[hoveredServiceIndex]?.title.toLowerCase().replace(/\s+/g, "-")}`}
                                      onClick={() => setIsServicesOpen(false)}
                                      className="mt-6 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-full transition-all"
                                      role="menuitem"
                                    >
                                      Learn More
                                    </Link>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {services.map((service, index) => (
                            <motion.div
                              key={service.id}
                              role="menuitem"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`relative flex flex-col h-full bg-gray-800/60 rounded-lg overflow-hidden group cursor-pointer border border-gray-700 transition-all duration-500 ease-out transform-gpu ${
                                hoveredServiceIndex === index ? "ring-2 ring-blue-500 scale-[1.02]" : ""
                              }`}
                              onMouseEnter={() => setHoveredServiceIndex(index)}
                              onFocus={() => setHoveredServiceIndex(index)}
                              tabIndex={0}
                            >
                              <Link
                                href={`/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => setIsServicesOpen(false)}
                                className="flex items-start p-4 h-full relative z-10 group"
                              >
                                <div className="w-full transition-transform duration-500 ease-out transform-gpu group-hover:translate-y-[-2px]">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative">
                                      <Image
                                        src={getImageUrl(service.image)}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <h3 className="text-base font-medium text-white">
                                      {service.title}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-gray-300 leading-snug">
                                    {service.description}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium"
          >
            About
          </Link>

          <Link
            href="/careers"
            className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium"
          >
            Careers
          </Link>
        </div>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white bg-gradient-to-br from-blue-500 to-teal-500 rounded-full shadow-lg"
            aria-label="Contact us"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
            <span className="relative flex items-center">
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact Us
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

const Navbar = () => {
  return (
    <>
      <NavbarMobile />
      <NavbarDesktop />
    </>
  )
}

export default Navbar