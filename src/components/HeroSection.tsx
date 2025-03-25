"use client"
import { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import ScrollDownIndicator from "./ScrollDownIndicator"

// Define the expected structure of the hero data
type HeroSectionData = {
  id: string
  tag: string
  title: string
  highlighted_title: string
  description: string
  button_name: string
  button_link: string
  animation_settings: {
    cycleDuration: number
    animationDuration: number
    initialRevealDelay: number
  }
  images: {
    src: string
    alt: string
  }[]
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: HeroSectionData = {
  id: "fallback-id",
  tag: "GLOBAL SOLUTIONS",
  title: "Your Gateway to the",
  highlighted_title: "INTERNATIONAL MARKET",
  description:
    "Our specialized import and export solutions connect your business with global opportunities. Experience seamless trade and unparalleled service.",
  button_name: "Get in Touch",
  button_link: "/contact",
  animation_settings: {
    cycleDuration: 5000,
    animationDuration: 1500,
    initialRevealDelay: 1000,
  },
  images: [
    {
      src: "https://hrrfjlbkbjmzkyihcufw.supabase.co/storage/v1/object/public/hero-images/elb2mitjzim.webp",
      alt: "Import & Export Services",
    },
    {
      src: "https://hrrfjlbkbjmzkyihcufw.supabase.co/storage/v1/object/public/hero-images/b2u0dla21u.webp",
      alt: "Chemical Waste Management",
    },
    {
      src: "https://hrrfjlbkbjmzkyihcufw.supabase.co/storage/v1/object/public/hero-images/zm5rsoaw5s.webp",
      alt: "Salsabeel Al Janoob Import Export",
    },
  ],
}

export default function HeroSection() {
  const [data, setData] = useState<HeroSectionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [initialRevealComplete, setInitialRevealComplete] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dataFetchedRef = useRef(false)

  // Fetch hero data from Supabase - only once
  useEffect(() => {
    if (dataFetchedRef.current) return

    async function fetchData() {
      try {
        console.log("Fetching hero section data from Supabase...")

        const { data: heroSections, error } = await supabase
          .from("hero_sections")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")
          setData(FALLBACK_DATA)
          return
        }

        if (!heroSections || heroSections.length === 0) {
          console.log("No hero section data found, using fallback data")
          setData(FALLBACK_DATA)
          return
        }

        const processedData: HeroSectionData = {
          ...heroSections[0],
          images: Array.isArray(heroSections[0].images) ? heroSections[0].images : [],
        }

        if (processedData.images.length === 0) {
          console.log("No hero images found, using fallback data")
          setData(FALLBACK_DATA)
          return
        }

        setData(processedData)
      } catch (error) {
        console.error("Error fetching hero data:", error)
        console.log("Using fallback data due to fetch error")
        setData(FALLBACK_DATA)
      } finally {
        dataFetchedRef.current = true
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate the next image index
  const nextImageIndex = useMemo(() => {
    if (!data?.images?.length) return 0
    return (currentImageIndex + 1) % data.images.length
  }, [currentImageIndex, data?.images?.length])

  // Handle image cycling and curtain effect
  useEffect(() => {
    if (!initialRevealComplete || !data?.images || data.images.length <= 1) return

    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current)

    const { cycleDuration, animationDuration } = data.animation_settings

    const cycleImages = () => {
      setIsAnimating(true)
      animationTimerRef.current = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length)
        setIsAnimating(false)
        cycleTimerRef.current = setTimeout(cycleImages, cycleDuration - animationDuration)
      }, animationDuration)
    }

    cycleTimerRef.current = setTimeout(cycleImages, 1000)

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
    }
  }, [initialRevealComplete, data])

  // Handle initial reveal delay
  useEffect(() => {
    if (!data) return
    const initialTimer = setTimeout(() => {
      setInitialRevealComplete(true)
    }, data.animation_settings.initialRevealDelay + 3000)
    return () => clearTimeout(initialTimer)
  }, [data])

  const textAnimationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: delay + 2 },
    }),
  }

  const initialCurtainVariants = {
    initial: {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    animate: {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      transition: {
        duration: 2.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 1,
      },
    },
  }

  if (isLoading) {
    return (
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-[10000] overflow-hidden flex items-center justify-center bg-zinc-900"
        role="status"
        aria-label="Loading hero section"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-white text-2xl mt-4">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error("Error state detected but using fallback data")
    // We'll use the fallback data instead of showing an error
    // This code won't execute if we properly set fallback data in the fetchData function
  }

  if (!data) {
    return null // Or a suitable fallback UI
  }

  return (
    <section className="relative h-screen overflow-hidden" aria-label="Hero section showcasing global trade services">
      <AnimatePresence>
        {!initialRevealComplete && (
          <motion.div
            className="absolute inset-0 z-50 bg-black"
            variants={initialCurtainVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 2.8 }}
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0">
        {data.images.length > 0 && (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={data.images[nextImageIndex]?.src || ""}
                alt={data.images[nextImageIndex]?.alt || ""}
                className="object-cover w-full h-full"
              />
            </div>
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0 z-1"
                initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                animate={{
                  clipPath: isAnimating
                    ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                    : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
                transition={{
                  duration: data.animation_settings.animationDuration / 1000,
                  ease: [0.645, 0.045, 0.355, 1],
                }}
              >
                <img
                  src={data.images[currentImageIndex]?.src || ""}
                  alt={data.images[currentImageIndex]?.alt || ""}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30 z-10"
        aria-hidden="true"
      />
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        <motion.span
          variants={textAnimationVariants}
          custom={1.7}
          initial="hidden"
          animate="visible"
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/15"
        >
          {data.tag}
        </motion.span>
        <motion.h1
          variants={textAnimationVariants}
          custom={1.9}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {data.title}{" "}
          <span className="tracking-extra-wider relative inline-block">
            {data.highlighted_title}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 4.3 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/10 via-white/60 to-white/10"
            />
          </span>
        </motion.h1>
        <motion.p
          variants={textAnimationVariants}
          custom={2.1}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {data.description}
        </motion.p>
        <motion.div variants={textAnimationVariants} custom={2.3} initial="hidden" animate="visible">
          <a
            href={data.button_link}
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-white text-zinc-950 transition-all duration-300 ease-out hover:bg-white/95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            aria-label={data.button_name}
          >
            <div
              className="absolute inset-0 scale-0 bg-white/10 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 transform-gpu"
              aria-hidden="true"
            />
            <span className="relative z-20 font-medium tracking-wide">{data.button_name}</span>
            {!isHovering && (
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  times: [0, 0.5, 1],
                  ease: "easeInOut",
                }}
                className="absolute inset-0 z-10 rounded-full bg-white/20"
                aria-hidden="true"
              />
            )}
          </a>
        </motion.div>
        {data.images.length > 1 && (
          <motion.div
            variants={textAnimationVariants}
            custom={2.5}
            initial="hidden"
            animate="visible"
            className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-30"
            role="tablist"
            aria-label="Hero image navigation"
          >
            {data.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => {
                  setCurrentImageIndex(index)
                  setIsAnimating(true)
                  if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
                  if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
                  animationTimerRef.current = setTimeout(() => {
                    setIsAnimating(false)
                  }, data.animation_settings.animationDuration)
                }}
                aria-label={`View image ${index + 1}`}
                aria-current={index === currentImageIndex ? "true" : "false"}
              />
            ))}
          </motion.div>
        )}
      </div>
      <ScrollDownIndicator />
    </section>
  )
}

