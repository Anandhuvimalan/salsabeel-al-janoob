"use client"
import React, { useEffect, useRef, useState, createContext, useContext } from "react"
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
  src: string
  title: string
  category: string
  content: React.ReactNode
}

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({
  onCardClose: () => {},
  currentIndex: 0,
})

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll
      checkScrollability()
    }
  }, [initialScroll])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const smoothScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = direction === 'left' ? -300 : 300
    const start = carouselRef.current.scrollLeft
    const target = start + scrollAmount
    const duration = 500
    
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuad(progress)
      
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = start + (scrollAmount * eased)
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const easeOutQuad = (t: number) => t * (2 - t)

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 768 ? 230 : 384
      const gap = window.innerWidth < 768 ? 4 : 8
      const scrollPosition = (cardWidth + gap) * (index + 1)
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (carouselRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - carouselRef.current.offsetLeft)
      setScrollLeftStart(carouselRef.current.scrollLeft)
      carouselRef.current.style.scrollBehavior = 'auto'
      carouselRef.current.style.cursor = 'grabbing'
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    carouselRef.current.scrollLeft = scrollLeftStart - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth'
      carouselRef.current.style.cursor = 'grab'
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full group">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-20 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className={cn("flex flex-row justify-start gap-4 pl-4", "max-w-7xl mx-auto")}>
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 * index, ease: "easeOut" }
                }}
                key={`card-${index}`}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between z-50 pointer-events-none">
          <motion.button
            className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 pointer-events-auto"
            onClick={() => smoothScroll('left')}
            disabled={!canScrollLeft}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-800" />
          </motion.button>
          
          <motion.button
            className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 pointer-events-auto"
            onClick={() => smoothScroll('right')}
            disabled={!canScrollRight}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
  const { onCardClose, currentIndex } = useContext(CarouselContext)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }

    document.body.style.overflow = open ? "hidden" : "auto"
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useOutsideClick(containerRef, () => handleClose())

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    onCardClose(index)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-[150] overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit my-10 p-4 md:p-10 rounded-3xl font-sans relative"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage src={card.src} alt={card.title} fill className="object-cover absolute z-10 inset-0" />
      </motion.button>
    </>
  )
}

export const BlurImage = ({ className, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true)
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm grayscale" : "blur-0 grayscale-0",
        className
      )}
      onLoad={() => setLoading(false)}
      loading="lazy"
      decoding="async"
      alt={alt || "Project image"}
      {...rest}
    />
  )
}