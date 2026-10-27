"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { BrandLoader } from "@/components/ui/brand-loader"
import ScrollDownIndicator from "./ScrollDownIndicator"

// Define the expected structure of the hero data
export type HeroSectionData = {
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
      src: "https://tnaxeecfbmgcxgnlclji.supabase.co/storage/v1/object/public/hero-images/elb2mitjzim.webp",
      alt: "Import & Export Services",
    },
    {
      src: "https://tnaxeecfbmgcxgnlclji.supabase.co/storage/v1/object/public/hero-images/b2u0dla21u.webp",
      alt: "Chemical Waste Management",
    },
    {
      src: "https://tnaxeecfbmgcxgnlclji.supabase.co/storage/v1/object/public/hero-images/zm5rsoaw5s.webp",
      alt: "Salsabeel Al Janoob Import Export",
    },
  ],
}

// Keep the loader up at least this long so it doesn't flash, and never longer than the max
const LOADER_MIN_MS = 600
const LOADER_MAX_MS = 2500

function normalizeHeroData(row: any): HeroSectionData {
  const images = Array.isArray(row?.images) ? row.images.filter((image: any) => image?.src) : []
  if (!row || images.length === 0) return FALLBACK_DATA
  return {
    ...row,
    images,
    animation_settings: { ...FALLBACK_DATA.animation_settings, ...(row.animation_settings || {}) },
  }
}

export default function HeroSection({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<HeroSectionData | null>(() => (initialData ? normalizeHeroData(initialData) : null))
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // Slide being wiped away on top of the current one (null when idle)
  const [leavingImageIndex, setLeavingImageIndex] = useState<number | null>(null)
  const [firstImageLoaded, setFirstImageLoaded] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const mountedAtRef = useRef(Date.now())

  // Only fetch on the client when the server didn't provide data
  useEffect(() => {
    if (data) return

    async function fetchData() {
      try {
        const { data: heroSections, error } = await supabase
          .from("hero_sections")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)

        if (error) {
          console.error("Supabase error:", error)
          setData(FALLBACK_DATA)
          return
        }

        setData(normalizeHeroData(heroSections?.[0]))
      } catch (error) {
        console.error("Error fetching hero data:", error)
        setData(FALLBACK_DATA)
      }
    }

    fetchData()
  }, [data])

  // Lift the loader once the first slide is ready (bounded by min/max durations)
  useEffect(() => {
    if (revealed) return
    const elapsed = Date.now() - mountedAtRef.current
    const delay = firstImageLoaded ? Math.max(0, LOADER_MIN_MS - elapsed) : Math.max(0, LOADER_MAX_MS - elapsed)
    const timer = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timer)
  }, [firstImageLoaded, revealed])

  const handleFirstImageLoad = useCallback(() => setFirstImageLoaded(true), [])

  const imageCount = data?.images.length ?? 0
  const animationDuration = data?.animation_settings.animationDuration ?? 1500
  const cycleDuration = data?.animation_settings.cycleDuration ?? 5000

  // Switch slides: the current slide becomes the "leaving" layer that wipes away
  // on top while the target (already loaded and painted) sits underneath.
  const currentIndexRef = useRef(0)
  const goToSlide = useCallback(
    (target: number) => {
      const current = currentIndexRef.current
      if (target === current) return
      currentIndexRef.current = target
      setLeavingImageIndex(current)
      setCurrentImageIndex(target)
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = setTimeout(() => setLeavingImageIndex(null), animationDuration)
    },
    [animationDuration],
  )

  // Auto-advance; restarts whenever the slide changes (including manual clicks)
  useEffect(() => {
    if (!revealed || imageCount <= 1) return
    const timer = setTimeout(() => goToSlide((currentImageIndex + 1) % imageCount), cycleDuration)
    return () => clearTimeout(timer)
  }, [revealed, imageCount, currentImageIndex, cycleDuration, goToSlide])

  useEffect(() => () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
  }, [])

  const textAnimationVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  }
  const textState = revealed ? "visible" : "hidden"

  if (!data) {
    return (
      <section className="relative h-screen overflow-hidden bg-zinc-950" aria-label="Hero section">
        <BrandLoader label="Loading hero section" />
      </section>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden bg-zinc-950" aria-label="Hero section showcasing global trade services">
      <BrandLoader exiting={revealed} label="Loading hero section" />
      {/* All slides stay mounted (and loaded); only their layer state changes. See .hero-slide in globals.css */}
      <div className="absolute inset-0" style={{ ["--hero-wipe-ms" as string]: `${animationDuration}ms` }}>
        {data.images.map((image, index) => {
          const isCurrent = index === currentImageIndex
          const isLeaving = index === leavingImageIndex
          return (
            <div
              key={`${index}-${image.src}`}
              className={`hero-slide${isCurrent && revealed ? " is-active" : ""}${isLeaving ? " is-leaving" : ""}${isCurrent || isLeaving ? " is-shown" : ""}`}
              style={{ zIndex: isLeaving ? 2 : isCurrent ? 1 : 0 }}
              aria-hidden={!isCurrent}
            >
              <Image
                src={image.src}
                alt={isCurrent ? image.alt || "" : ""}
                fill
                sizes="100vw"
                quality={80}
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
                onLoad={index === 0 ? handleFirstImageLoad : undefined}
                className="hero-slide__img object-cover"
              />
            </div>
          )
        })}
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30 z-10"
        aria-hidden="true"
      />
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 text-center max-w-7xl mx-auto">
        <motion.span
          variants={textAnimationVariants}
          custom={0.35}
          initial="hidden"
          animate={textState}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-white/90 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/15"
        >
          {data.tag}
        </motion.span>
        <motion.h1
          variants={textAnimationVariants}
          custom={0.5}
          initial="hidden"
          animate={textState}
          className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
        >
          {data.title}{" "}
          <span className="tracking-extra-wider relative inline-block">
            {data.highlighted_title}
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: revealed ? "100%" : "0%" }}
              transition={{ duration: 0.8, delay: revealed ? 1.1 : 0 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/10 via-white/60 to-white/10"
            />
          </span>
        </motion.h1>
        <motion.p
          variants={textAnimationVariants}
          custom={0.65}
          initial="hidden"
          animate={textState}
          className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed"
        >
          {data.description}
        </motion.p>
        <motion.div variants={textAnimationVariants} custom={0.8} initial="hidden" animate={textState}>
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
            custom={1}
            initial="hidden"
            animate={textState}
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
                onClick={() => goToSlide(index)}
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
