"use client"
import type React from "react"
import { useEffect, useRef, useState, createContext, useContext } from "react"
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image, { type ImageProps } from "next/image"
import { useOutsideClick } from "@/hooks/use-outside-click"

interface CarouselProps {
  items: React.ReactNode[]
  initialScroll?: number
}

type Card = {
  id: string // Added unique ID for better tracking
  src: string
  title: string
  category: string
  content: React.ReactNode
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void // Added setter for better control
}>({
  onCardClose: () => {},
  currentIndex: 0,
  setCurrentIndex: () => {},
})

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const itemWidths = useRef<number[]>([])

  // Calculate card positions for accurate navigation
  const calculateCardPositions = () => {
    if (!carouselRef.current || items.length === 0) return []

    const positions: number[] = [0]
    const cards = carouselRef.current.querySelectorAll(".carousel-card")
    let currentPosition = 0

    cards.forEach((card, index) => {
      if (index === 0) return
      const cardWidth = card.getBoundingClientRect().width
      const cardMargin = Number.parseInt(window.getComputedStyle(card).marginRight)
      itemWidths.current[index - 1] = cardWidth + cardMargin
      currentPosition += cardWidth + cardMargin
      positions.push(currentPosition)
    })

    return positions
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()

      // Recalculate card positions on window resize
      const handleResize = () => {
        calculateCardPositions()
        checkScrollability()
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [initialScroll, items])

  // More detailed scroll check with debounce
  const checkScrollability = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    const isAtStart = scrollLeft <= 10
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10

    setCanScrollLeft(!isAtStart)
    setCanScrollRight(!isAtEnd)

    // Find current index based on scroll position
    const positions = calculateCardPositions()
    const currentPos = scrollLeft

    let newIndex = 0
    for (let i = 0; i < positions.length; i++) {
      if (currentPos >= positions[i]) {
        newIndex = i
      } else {
        break
      }
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  const smoothScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const positions = calculateCardPositions()
    const currentPos = carouselRef.current.scrollLeft

    let targetPos: number
    if (direction === "left") {
      const prevIndex = positions.findIndex((pos) => pos >= currentPos) - 1
      targetPos = prevIndex >= 0 ? positions[prevIndex] : 0
    } else {
      const nextIndex = positions.findIndex((pos) => pos > currentPos)
      targetPos = nextIndex !== -1 ? positions[nextIndex] : positions[positions.length - 1]
    }

    const scrollAmount = targetPos - currentPos
    const start = currentPos
    const duration = 400 // Slightly faster for more responsive feel

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      if (carouselRef.current) {
        carouselRef.current.scrollLeft = start + scrollAmount * eased
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        checkScrollability()
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  // Better easing function for smoother animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const handleCardClose = (index: number) => {
    if (!carouselRef.current) return

    const positions = calculateCardPositions()
    if (positions.length > index) {
      carouselRef.current.scrollTo({
        left: positions[index],
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  // Improved mouse handling for smoother drag experience
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeftStart(carouselRef.current.scrollLeft)
    carouselRef.current.style.scrollBehavior = "auto"
    carouselRef.current.style.cursor = "grabbing"

    // Prevent text selection during drag
    document.body.style.userSelect = "none"
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()

    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Increased sensitivity for better feel
    carouselRef.current.scrollLeft = scrollLeftStart - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = "smooth"
      carouselRef.current.style.cursor = "grab"
      document.body.style.userSelect = ""

      // Snap to nearest card
      const { scrollLeft } = carouselRef.current
      const positions = calculateCardPositions()

      let closestPos = positions[0]
      let closestDist = Math.abs(scrollLeft - positions[0])

      positions.forEach((pos) => {
        const dist = Math.abs(scrollLeft - pos)
        if (dist < closestDist) {
          closestDist = dist
          closestPos = pos
        }
      })

      carouselRef.current.scrollTo({
        left: closestPos,
        behavior: "smooth",
      })
    }
  }

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return

    // Prevent default to avoid page scrolling while swiping carousel
    if (e.touches.length === 1) {
      setIsDragging(true)
      setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
      setScrollLeftStart(carouselRef.current.scrollLeft)
      carouselRef.current.style.scrollBehavior = "auto"
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return

    // Prevent page scrolling
    e.preventDefault()

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Slightly reduced sensitivity for better control
    carouselRef.current.scrollLeft = scrollLeftStart - walk
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex, setCurrentIndex }}>
      <div className="relative w-full group">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-20 scroll-smooth [scrollbar-width:none] no-scrollbar"
          ref={carouselRef}
          onScroll={debounce(() => {
            if (carouselRef.current) {
              checkScrollability()
            }
          }, 50)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className={cn("flex flex-row justify-start gap-4 pl-4", "max-w-7xl mx-auto")}>
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: Math.min(0.05 * index, 0.3), // Reduce delay to prevent long waits
                    ease: [0.23, 1, 0.32, 1], // Use cubic bezier for smoother animation
                  },
                }}
                key={`card-${index}`}
                className="carousel-card last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between z-50 pointer-events-none hidden lg:flex">
          <motion.button
            className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 pointer-events-auto"
            onClick={() => smoothScroll("left")}
            disabled={!canScrollLeft}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-800" />
          </motion.button>

          <motion.button
            className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 pointer-events-auto"
            onClick={() => smoothScroll("right")}
            disabled={!canScrollRight}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: canScrollRight ? 1 : 0.3 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-800" />
          </motion.button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export const Card = ({ card, index, layout = false }: { card: Card; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null!)
  const { onCardClose, setCurrentIndex } = useContext(CarouselContext)
  const cardId = card.id || `card-${index}` // Fallback for backward compatibility

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }

    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKeyDown)
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useOutsideClick(containerRef, () => handleClose())

  const handleOpen = () => {
    setOpen(true)
    // Update current index when card is opened
    setCurrentIndex(index)
  }

  const handleClose = () => {
    // Simply set open to false and let Framer Motion handle the animation
    setOpen(false)
    // Delay the onCardClose call slightly to allow the exit animation to complete
    setTimeout(() => {
      onCardClose(index)
    }, 300)
  }

  return (
    <>
      <AnimatePresence mode="sync">
        {open && (
          <div className="fixed inset-0 h-screen z-[150] overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1],
                exit: { duration: 0.25 },
              }}
              ref={containerRef}
              layoutId={layout ? `card-container-${cardId}` : undefined}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit my-10 p-4 md:p-10 rounded-3xl font-sans relative z-[160]"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${cardId}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${cardId}` : undefined}
                className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white"
              >
                {card.title}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="py-10"
              >
                {card.content}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId={layout ? `card-container-${cardId}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${cardId}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${cardId}` : undefined}
            className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 56vw, 96vw"
          className="object-cover absolute z-10 inset-0"
          priority={index < 2} // Prioritize loading the first two images
        />
      </motion.button>
    </>
  )
}

export const BlurImage = ({ className, alt, priority = false, ...rest }: ImageProps & { priority?: boolean }) => {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm grayscale" : "blur-0 grayscale-0",
        error ? "bg-gray-200 dark:bg-gray-800" : "",
        className,
      )}
      onLoad={() => setLoading(false)}
      onError={() => {
        setLoading(false)
        setError(true)
      }}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      alt={alt || "Project image"}
      priority={priority}
      {...rest}
    />
  )
}

