"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { usePrefetchedSection } from "@/components/SectionDataProvider"
import { SectionSkeleton } from "@/components/ui/section-skeleton"

type ProcessStep = {
  title: string
  description: string
  iconSrc: string
  hoverFrom: string
  hoverTo: string
  iconFrom: string
  iconTo: string
}

type ProcessData = {
  section: {
    heading: string
    description: string
    buttonLink: string
    buttonText: string
  }
  steps: ProcessStep[]
}

// Fallback data to use when Supabase fetch fails
const FALLBACK_DATA: ProcessData = {
  section: {
    heading: "Our Seamless Import & Export Process",
    description: "Follow our step-by-step approach to experience hassle-free import and export services.",
    buttonLink: "/about",
    buttonText: "More About Us",
  },
  steps: [
    {
      title: "Consultation & Planning",
      description: "Discuss your needs and craft a tailored trade strategy.",
      iconSrc: "step-0-1741688888360-xbr80yttg5h.svg",
      hoverFrom: "hover:from-purple-600",
      hoverTo: "hover:to-purple-800",
      iconFrom: "from-purple-500",
      iconTo: "to-purple-700",
    },
    {
      title: "Documentation & Compliance",
      description: "We handle paperwork and ensure full regulatory compliance.",
      iconSrc: "step-1-1741688888360-r5a9jbg34i8.svg",
      hoverFrom: "hover:from-blue-600",
      hoverTo: "hover:to-blue-800",
      iconFrom: "from-blue-500",
      iconTo: "to-blue-700",
    },
    {
      title: "Logistics & Transportation",
      description: "Efficient shipping solutions to move your goods globally.",
      iconSrc: "step-2-1741688888360-rn0408nxcmf.svg",
      hoverFrom: "hover:from-red-600",
      hoverTo: "hover:to-red-800",
      iconFrom: "from-red-500",
      iconTo: "to-red-700",
    },
    {
      title: "Customs Clearance",
      description: "Expert management of customs procedures for smooth border crossings.",
      iconSrc: "step-3-1741688888361-yjnmobf4it.svg",
      hoverFrom: "hover:from-yellow-600",
      hoverTo: "hover:to-yellow-800",
      iconFrom: "from-yellow-500",
      iconTo: "to-yellow-700",
    },
    {
      title: "Delivery & After Service",
      description: "Reliable delivery and dedicated support after shipment.",
      iconSrc: "step-4-1741688888361-qllfuqt9x8.svg",
      hoverFrom: "hover:from-green-600",
      hoverTo: "hover:to-green-800",
      iconFrom: "from-green-500",
      iconTo: "to-green-700",
    },
    {
      title: "After Sales Support",
      description: "Continuous support and feedback to help your business thrive.",
      iconSrc: "step-5-1741688888361-7imw3ek70jc.svg",
      hoverFrom: "hover:from-orange-600",
      hoverTo: "hover:to-orange-800",
      iconFrom: "from-orange-500",
      iconTo: "to-orange-700",
    },
  ],
}

// One stop on the route. `reached` = the scroll-linked route line has arrived here.
const ProcessStepItem = ({
  index,
  title,
  description,
  iconSrc,
  reached,
}: {
  index: number
  title: string
  description: string
  iconSrc: string
  reached: boolean
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid grid-cols-[3.5rem_1fr] gap-5 sm:gap-8 pb-12 last:pb-0"
    >
      {/* Stop marker on the route */}
      <div className="relative z-10 flex justify-center" aria-hidden="true">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-[background-color,border-color,box-shadow] duration-500 ${
            reached
              ? "border-teal-400 bg-slate-900 shadow-[0_0_0_6px_rgba(59,198,198,0.15)]"
              : "border-slate-200 bg-white"
          }`}
        >
          <img
            src={iconSrc || "/placeholder.svg"}
            alt=""
            width={24}
            height={24}
            className={`h-6 w-6 transition-[filter,opacity] duration-500 ${
              reached ? "brightness-0 invert" : "brightness-0 opacity-60"
            }`}
            loading="lazy"
          />
        </div>
      </div>

      <div
        className={`rounded-2xl border bg-white p-6 sm:p-7 transition-[border-color,box-shadow] duration-500 ${
          reached ? "border-teal-200 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]" : "border-slate-200/80"
        }`}
      >
        <div className="mb-2 flex items-center gap-3">
          <span
            className={`font-mono text-xs font-semibold tracking-[0.2em] transition-colors duration-500 ${
              reached ? "text-teal-500" : "text-slate-400"
            }`}
          >
            STEP {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.li>
  )
}

const getIconUrl = (path: string) => {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http") || path.startsWith("/")) return path
  return supabase.storage.from("process-icons").getPublicUrl(path).data.publicUrl
}

export default function ImportExportProcess() {
  const prefetched = usePrefetchedSection("process_section")
  const [processData, setProcessData] = useState<ProcessData | null>(() =>
    prefetched
      ? {
          section: prefetched.section,
          steps: prefetched.steps.map((step: ProcessStep) => ({ ...step, iconSrc: getIconUrl(step.iconSrc) })),
        }
      : null,
  )
  const [loading, setLoading] = useState(!prefetched)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (prefetched) return
    const fetchProcessData = async () => {
      try {
        const { data, error } = await supabase
          .from("process_section")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Supabase error:", error)
          console.log("Using fallback data due to Supabase error")

          // Apply the getIconUrl function to the fallback data steps
          const fallbackWithFullUrls = {
            ...FALLBACK_DATA,
            steps: FALLBACK_DATA.steps.map((step) => ({
              ...step,
              iconSrc: getIconUrl(step.iconSrc),
            })),
          }

          setProcessData(fallbackWithFullUrls)
          return
        }

        const stepsWithFullUrls = data.steps.map((step: ProcessStep) => ({
          ...step,
          iconSrc: getIconUrl(step.iconSrc),
        }))

        setProcessData({
          section: data.section,
          steps: stepsWithFullUrls,
        })
      } catch (error) {
        console.error("Error fetching process data:", error)
        console.log("Using fallback data due to fetch error")

        // Apply the getIconUrl function to the fallback data steps
        const fallbackWithFullUrls = {
          ...FALLBACK_DATA,
          steps: FALLBACK_DATA.steps.map((step) => ({
            ...step,
            iconSrc: getIconUrl(step.iconSrc),
          })),
        }

        setProcessData(fallbackWithFullUrls)
      } finally {
        setLoading(false)
      }
    }

    fetchProcessData()
  }, [])

  if (loading) {
    return <SectionSkeleton label="Loading process section" />
  }

  // We no longer need to show an error state since we're using fallback data
  // But we'll keep the error state in the component state for logging purposes
  if (!processData) {
    return null // This should never happen with fallback data
  }

  return <ProcessRoute data={processData} />
}

function ProcessRoute({ data }: { data: ProcessData }) {
  const routeRef = useRef<HTMLOListElement>(null)
  const steps = data.steps
  // Route line fills as the list scrolls through the middle of the viewport
  const { scrollYProgress } = useScroll({ target: routeRef, offset: ["start 65%", "end 55%"] })
  const [reachedCount, setReachedCount] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const count = Math.min(steps.length, Math.floor(progress * steps.length + 0.35))
    setReachedCount((previous) => (previous === count ? previous : count))
  })

  return (
    <section aria-labelledby="process-heading" className="relative overflow-clip bg-slate-50 py-24 sm:py-32 font-sans">
      {/* Subtle dotted "map" texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" />
            How it works
          </p>
          <h2 id="process-heading" className="text-4xl sm:text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900">
            {data.section.heading}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">{data.section.description}</p>

          {/* Route progress */}
          <div className="mt-10 hidden lg:block" aria-hidden="true">
            <div className="flex items-baseline gap-2 font-mono text-slate-900">
              <span className="text-4xl font-bold tabular-nums">{String(Math.max(reachedCount, 1)).padStart(2, "0")}</span>
              <span className="text-sm text-slate-400">/ {String(steps.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 h-1 w-48 overflow-hidden rounded-full bg-slate-200">
              <motion.div className="h-full origin-left rounded-full bg-teal-400" style={{ scaleX: scrollYProgress }} />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500 min-h-[1.25rem]">
              {steps[Math.max(reachedCount, 1) - 1]?.title}
            </p>
          </div>

          <Link
            href={data.section.buttonLink}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-teal-600"
            rel={data.section.buttonLink.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {data.section.buttonText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.header>

        <ol ref={routeRef} className="relative" aria-label="Process steps">
          {/* Route line: dashed track + teal fill that follows scroll */}
          <div
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-px -translate-x-1/2 [background-image:linear-gradient(to_bottom,rgb(203_213_225)_50%,transparent_50%)] [background-size:1px_10px]"
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-[3px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-teal-300 to-teal-500"
            style={{ scaleY: scrollYProgress }}
          />
          {steps.map((step, index) => (
            <ProcessStepItem
              key={index}
              index={index}
              title={step.title}
              description={step.description}
              iconSrc={step.iconSrc}
              reached={index < reachedCount}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

