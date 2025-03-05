"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Import the services data from the JSON file
import servicesData from "../../../data/services.json"

const menuVariants = {
  hidden: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  // Removed exit variant to eliminate delay on unmount
}

const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  // Removed exit variant
}

const serviceDropdownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  // Removed exit variant
}

const serviceItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  // Removed exit variant
}

const NavbarMobile = () => {
  // Use the services from the imported JSON file
  const services = servicesData.services
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      setIsServicesOpen(false)
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setScrolled(currentScrollY > 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <nav
      className={`block md:block lg:hidden text-white w-full fixed z-[100] transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${scrolled || isMenuOpen ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
    >
      <div className="top-0 left-0 w-full flex items-center justify-between px-6 py-4">
        <motion.div
          className="flex items-center space-x-2 z-50"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image src="/logo.svg" alt="Logo" width={32} height={32} className="rounded-full" />
          <div className="flex flex-col">
            <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Salsabeel Al Janoob Imp Exp
            </span>
            <span className="text-xs text-gray-300">Your gateway to the international market</span>
          </div>
        </motion.div>

        <button
          className="z-50 relative w-10 h-10 flex items-center justify-center focus:outline-none"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`block absolute h-0.5 w-6 bg-white transform transition duration-500 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
            ></span>
            <span
              className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`block absolute h-0.5 w-6 bg-white transform transition duration-500 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
            ></span>
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            // Removed exit animation so the menu unmounts instantly
            className="fixed top-0 left-0 w-full h-[100vh] bg-gray-900/95 backdrop-blur-lg text-white z-40 flex flex-col overflow-y-auto"
          >
            <motion.div className="py-20 px-6 space-y-6 h-full flex flex-col">
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/"
                  className="text-lg font-semibold hover:text-gray-300 transition-colors duration-200 text-left block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={menuItemVariants} className="w-full">
                <div
                  className="flex justify-between items-center cursor-pointer py-2"
                  onClick={() => setIsServicesOpen((prev) => !prev)}
                  aria-expanded={isServicesOpen}
                >
                  <h2 className="text-lg font-semibold">Services</h2>
                  <motion.div
                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      // Removed exit animation so the dropdown unmounts immediately
                      variants={serviceDropdownVariants}
                      className="mt-2 grid grid-cols-1 gap-3 overflow-hidden pl-2"
                    >
                      {services.map((service) => (
                        <motion.div key={service.id} variants={serviceItemVariants} layout className="w-full">
                          <Link
                            href={`/${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                            className="flex items-center p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/80 transition-all duration-200 text-left border border-gray-700/50 hover:border-gray-600"
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsServicesOpen(false)
                            }}
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden relative flex-shrink-0 mr-3">
                              <Image
                                src={service.image || "/placeholder.svg"}
                                alt={service.title}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold">{service.title}</h3>
                              <p className="text-xs text-gray-400 line-clamp-2">{service.description}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Link
                  href="/about"
                  className="text-lg font-semibold hover:text-gray-300 transition-colors duration-200 text-left block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/careers"
                  className="text-lg font-semibold hover:text-gray-300 transition-colors duration-200 text-left block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>
              </motion.div>
              <div className="mt-auto pt-6">
                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium rounded-full shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default NavbarMobile
