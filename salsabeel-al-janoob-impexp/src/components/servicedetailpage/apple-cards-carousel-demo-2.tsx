"use client"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

interface ProjectsCarouselProps {
  projects: Array<{
    category: string
    title: string
    src: string
    content: React.ReactNode
  }>
  title?: string
  titleColor?: string
}

export default function ProjectsCarousel({
  projects,
  title = "Our Recent Projects",
  titleColor = "text-neutral-800"
}: ProjectsCarouselProps) {
  const cards = projects.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ))

  return (
    <div className="w-full h-full py-20">
      <h2 className={`max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold font-sans ${titleColor}`}>
        {title}
      </h2>
      <Carousel items={cards} />
    </div>
  )
}