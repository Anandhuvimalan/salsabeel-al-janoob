"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Mail } from "lucide-react"
import NavbarMobile from "@/components/NavBar/NavbarMobile"

// Import the services data from the JSON file
import servicesData from "../../data/services.json"

const NavbarDesktop = () => {
  // Use the services from the imported JSON file
  const services = servicesData.services

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
        images[index] = service.image
      }
      setPreloadedImages(images)
    }

    preload()
  }, [services])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const hasBackground = isScrolled || isNavHovered

  return (
    <nav
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
      className={`hidden lg:block fixed top-0 left-0 w-full z-[100] py-4 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${hasBackground ? "bg-gray-900/95 backdrop-blur-sm text-white shadow-lg" : "bg-transparent text-white"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="Logo" width={45} height={45} className="rounded-full" />
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Salsabeel Al Janoob Imp Exp
              </span>
              <div className="tracking-wide text-sm text-gray-300">Your gateway to the international market</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex space-x-8 items-center">
          <Link
            href="/"
            className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium"
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
              className="px-4 py-2 border border-transparent hover:border-blue-400 rounded-full transition-all font-medium flex items-center space-x-1"
              onClick={() => setIsServicesOpen((prev) => !prev)}
            >
              <span>Services</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 transform group-hover:rotate-180" />
            </button>
            {isServicesOpen && <div className="fixed inset-0 z-30 pointer-events-none" />}

            {/* Invisible hover detection area */}
            {isServicesOpen && (
              <div className="absolute left-0 w-full h-8 -bottom-8 z-50" onMouseEnter={() => setIsServicesOpen(true)} />
            )}
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="fixed left-0 right-0 w-full bg-gray-900/95 backdrop-blur-md text-white z-40 shadow-2xl border-t border-gray-800 mt-2"
                >
                  <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Image section - constrained height and proper positioning */}
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
                                  src={preloadedImages[hoveredServiceIndex] || services[0].image}
                                  alt={services[hoveredServiceIndex]?.title || "Services"}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>

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

                      {/* Service items in grid */}
                      <div className="col-span-7">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {services.map((service, index) => (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.5,
                                ease: "easeOut",
                              }}
                              className={`relative flex flex-col h-full bg-gray-800/60 rounded-lg overflow-hidden group cursor-pointer border border-gray-700 transition-all duration-500 ease-out transform-gpu ${
                                hoveredServiceIndex === index ? "ring-2 ring-blue-500 scale-[1.02]" : ""
                              }`}
                              onMouseEnter={() => setHoveredServiceIndex(index)}
                              whileHover={{
                                y: -4,
                                scale: 1.02,
                                transition: {
                                  duration: 0.4,
                                  ease: [0.23, 1, 0.32, 1],
                                },
                              }}
                            >
                              <Link
                                href={`/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => setIsServicesOpen(false)}
                                className="flex items-start p-4 h-full relative z-10 group"
                              >
                                <div className="w-full transition-transform duration-500 ease-out transform-gpu group-hover:translate-y-[-2px]">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative transition-transform duration-500 ease-out transform-gpu group-hover:scale-105">
                                      <Image
                                        src={service.image || "/placeholder.svg"}
                                        alt={service.title}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <h3 className="text-base font-medium text-white transition-colors duration-500 ease-out group-hover:text-blue-400">
                                      {service.title}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-gray-300 leading-snug transition-colors duration-500 ease-out group-hover:text-gray-200">
                                    {service.description}
                                  </p>
                                </div>
                              </Link>
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-out`}
                              />
                              <div
                                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${service.gradient} transform origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100`}
                              />
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
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center">
              <Mail className="mr-2 h-4 w-4" />
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
